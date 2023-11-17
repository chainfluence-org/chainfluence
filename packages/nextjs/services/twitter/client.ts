// tokens.ts
import { randomBytes } from "crypto";
// import fs from "fs";
// import path from "path";
import Client, { auth } from "twitter-api-sdk";
import { getServiceRoleServerSupabaseClient } from "~~/services/supabase/serverClient";

const supabase = getServiceRoleServerSupabaseClient();
export interface UserAuthTokens {
  token?: string;
  state?: string;
  challenge?: string;
}

export const getUser = async (userId: string) => {
  const { token } = (await getUserAuthTokens(userId)) ?? {};
  return new auth.OAuth2User({
    client_id: process.env.X_CLIENT_ID as string,
    client_secret: process.env.X_CLIENT_SECRET as string,
    callback: process.env.X_CALLBACK_URL as string,
    scopes: ["tweet.read", "users.read", "follows.read"],
    token: token ? JSON.parse(token) : undefined,
  });
};

export const getTwitterUserClient = async (userId: string) => {
  return new Client(await getUser(userId));
};

export const generateAuthURL = async (userId: string) => {
  const state = randomBytes(12).toString("hex");
  const challenge = randomBytes(12).toString("hex");
  await updateUserAuthTokens(userId, {
    state,
    challenge,
  });
  const user = await getUser(userId);
  return user.generateAuthURL({
    state,
    code_challenge_method: "plain",
    code_challenge: challenge,
  });
};

export const handleAuthCode = async (userId: string, code: string) => {
  const user = await getUser(userId);
  const { state, challenge } = (await getUserAuthTokens(userId)) ?? {};
  if (state && challenge) {
    user.generateAuthURL({
      state,
      code_challenge_method: "plain",
      code_challenge: challenge,
    });
    const { token } = await user.requestAccessToken(code);
    await updateUserAuthTokens(userId, {
      token: JSON.stringify(token),
    });
  }
};

// Import your Supabase client

export const getUserAuthTokens = async (userId: string) => {
  const { data, error } = await supabase.from("user_auth_tokens").select("*").eq("id", userId).single();

  if (error) {
    console.error(error);
    return null;
  }

  return data as UserAuthTokens;
};

export const updateUserAuthTokens = async (userId: string, tokens: Partial<UserAuthTokens>) => {
  const { error } = await supabase.from("user_auth_tokens").upsert({ id: userId, ...tokens });

  if (error) {
    console.error(error);
  }
};
