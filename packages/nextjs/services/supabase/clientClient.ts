"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { getCookie } from "~~/utils";

// Supabase authorized client for use in client-side code
export const getClientSupabaseClient = () => {
  if (typeof document === "undefined") return createClientComponentClient();

  const token = getCookie("web3jwt");

  if (!token) {
    return createClientComponentClient();
  } else {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const headers = {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    };
    return createClient(url, anonKey, headers);
  }
};
