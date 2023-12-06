import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { auth } from "~~/auth";
import { Database } from "~~/types/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const userId = (await auth())?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const payload = await req.json();

    await supabase
      .from("projects")
      .insert({ id: userId, ...payload })
      .throwOnError();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
