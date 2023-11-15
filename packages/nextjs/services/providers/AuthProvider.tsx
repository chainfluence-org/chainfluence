import { createContext, useContext, useEffect, useState } from "react";
import { signMessage } from "@wagmi/core";
import { useAccount, useDisconnect } from "wagmi";
import { useAutoConnect } from "~~/hooks/scaffold-eth";

const AuthContext = createContext({ isLoading: false, isAuthenticated: false });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  useAutoConnect();
  const { address, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("isDisconnected", isDisconnected);
    console.log("isConnected", isConnected);
    console.log("isAuthenticated", isAuthenticated);
    console.log("address", address);
    console.log('getCookie("web3jwt")', getCookie("web3jwt"));

    setIsAuthenticated(!!getCookie("web3jwt"));
    if (isConnected && !isAuthenticated) {
      handleLogin();
    } else if (isDisconnected) {
      handleLogout();
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

  const handleLogout = async () => {
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
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function getCookie(name: string): string | null {
  if (!document) return null;

  const cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].trim();

    if (cookiePair.startsWith(name + "=")) {
      return decodeURIComponent(cookiePair.substring(name.length + 1));
    }
  }

  return null;
}
