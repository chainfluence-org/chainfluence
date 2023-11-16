import { NextResponse } from "next/server";
import { auth } from "~~/auth";
import { generateAuthURL } from "~~/services/twitter/client";

export async function GET() {
  // get userId from jwt
  const userId = (await auth())?.id;

  if (!userId) return new Response("Unauthorized", { status: 401 });

  return NextResponse.redirect(await generateAuthURL(userId));
}
