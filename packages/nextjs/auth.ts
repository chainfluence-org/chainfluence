import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "~~/utils";

export const auth = async () => {
  const address = cookies().get("address")?.value || "";
  const web3jwt = cookies().get("web3jwt")?.value || "";

  const validToken = await verifyToken(web3jwt, address);
  if (web3jwt && validToken) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const headers = {
      global: {
        headers: { Authorization: `Bearer ${web3jwt}` },
      },
      auth: { persistSession: false },
    };

    const supabase = createClient(url, anonKey, headers);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("user: ", user);

    if (user) {
      return user;
    }
  } else {
    if (address) cookies().delete("address");
    if (web3jwt) cookies().delete("web3jwt");
  }

  return null;
};
