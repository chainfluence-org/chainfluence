"use server";

import { auth } from "~~/auth";
import { ClosePage } from "~~/components/ClosePage";
import { getServiceRoleServerSupabaseClient } from "~~/services/supabase/serverClient";
import { getTwitterUserClient, handleAuthCode } from "~~/services/twitter/client";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = (await auth())?.id;

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const code = searchParams["code"] as string;

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

  return <ClosePage />;
}
