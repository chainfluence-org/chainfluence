import { NextResponse } from "next/server";
import { generateAuthURL } from "~~/services/twitter/client";

export async function GET() {
  return NextResponse.redirect(await generateAuthURL());
}
