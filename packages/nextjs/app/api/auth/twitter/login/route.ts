import { NextResponse } from "next/server";
import { authClient } from "~~/services/twitter/client";

const STATE = "my-state";

export async function GET() {
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge_method: "s256",
  });

  return NextResponse.redirect(authUrl);
}
