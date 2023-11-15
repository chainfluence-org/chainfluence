import { NextResponse } from "next/server";
import { getClient, handleAuthCode } from "~~/services/twitter/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    await handleAuthCode(code as string);
    console.log("successss");

    // await authClient.requestAccessToken(code as string);
    const client = await getClient();
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
    return NextResponse.json(tweets);
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
