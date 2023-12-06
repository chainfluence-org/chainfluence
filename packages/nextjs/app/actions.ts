"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "~~/types/supabase";

const supabase = createServerActionClient<Database>({ cookies });

export async function getProject(userId: string) {
  const { data } = await supabase.from("projects").select("*").eq("id", userId).single();

  return data;
}

export async function getProjectByContractAddress(contractAddress: string) {
  const { data } = await supabase.from("projects").select("*").eq("token_contract_address", contractAddress).single();

  return data;
}

export async function getProjects() {
  const { data } = await supabase.from("projects").select("*");

  if (!data) {
    return [];
  }

  return data;
}
