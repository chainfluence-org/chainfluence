import { NextResponse } from "next/server";
import { auth } from "~~/auth";
import { getServiceRoleServerSupabaseClient } from "~~/services/supabase/serverClient";
import { getTwitterUserClient, handleAuthCode } from "~~/services/twitter/client";

export async function GET(req: Request) {
  const userId = (await auth())?.id;

  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") as string;

    await handleAuthCode(userId, code);

    // await authClient.requestAccessToken(code as string);
    const client = await getTwitterUserClient(userId);
    const { data: user } = await client.users.findMyUser({
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

    const supabase = getServiceRoleServerSupabaseClient();
    await supabase
      .from("users")
      .update({ twitter: user?.username, twitter_profile_image_url: user?.profile_image_url })
      .eq("id", userId);

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
