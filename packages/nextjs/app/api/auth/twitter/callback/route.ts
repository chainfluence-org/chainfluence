import { NextResponse } from "next/server";
import { authClient, client } from "~~/services/twitter/client";

const STATE = "my-state";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    console.log({ code, state });

    if (state !== STATE) return NextResponse.json({ error: "State isn't matching" }, { status: 500 });
    const { token } = await authClient.requestAccessToken(code as string);
    console.log({ token });

    const tweets = await client.users.findMyUser({
      "user.fields": [
        "created_at",
        "description",
        "entities",
        "id",
        "location",
        "name",
        "pinned_tweet_id",
        "profile_image_url",
        "protected",
        "public_metrics",
        "url",
        "username",
        "verified",
      ],
    });
    console.log({ tweets });
    NextResponse.json(tweets.data);
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
