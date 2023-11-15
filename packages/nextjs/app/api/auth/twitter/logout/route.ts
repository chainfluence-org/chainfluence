import { NextResponse } from "next/server";
import { authClient } from "~~/services/twitter/client";

export async function GET() {
  try {
    const response = await authClient.revokeAccessToken();
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
  }
}
