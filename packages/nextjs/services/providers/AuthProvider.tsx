import { createContext, useContext, useEffect, useState } from "react";
import { getClientSupabaseClient } from "../supabase/clientClient";
import { signMessage } from "@wagmi/core";
import { useAccount, useDisconnect } from "wagmi";
import { useAutoConnect } from "~~/hooks/scaffold-eth";

const AuthContext = createContext({
  isLoading: false,
  isAuthenticated: false,
  logout: () => {
    //
  },
  user: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  useAutoConnect();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = getClientSupabaseClient();

  const fetchUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const isAuthenticated = !!authUser;

    setIsAuthenticated(isAuthenticated);

    if (isAuthenticated) {
      const { data: _user, error } = await supabase
        .from("users")
        .select("*")
        .eq("address", authUser?.user_metadata.address)
        .single();

      if (!error) return setUser(_user);
      console.log({ error });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isAuthenticated, address]);

  useEffect(() => {
    if (isConnected && !isAuthenticated) {
      handleLogin();
    }
  }, [isConnected, isAuthenticated, address]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const nonceResponse = await fetch(`/api/auth/web3/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const {
        user: [user],
      } = await nonceResponse.json();
      const message = process.env.NEXT_PUBLIC_WEB3AUTH_MESSAGE + user.auth.genNonce;
      try {
        const signedMessage = await signMessage({ message });

        const response = await fetch(`/api/auth/web3/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, signedMessage, nonce: user.auth.genNonce }),
        });

        setIsAuthenticated(response?.ok);
      } catch (err) {
        disconnect();
      }
    } catch (err) {
      console.error("An error occurred:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/auth/web3/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      setIsAuthenticated(!response?.ok);
    } catch (err) {
      console.error("An error occurred:", err);
    } finally {
      disconnect();
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    logout,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
