// tokens.ts
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import Client, { auth } from "twitter-api-sdk";

// import { getClientSupabaseClient } from "~~/services/supabase/client";

// const supabase = getClientSupabaseClient();
export interface PlatformTokens {
  token?: string;
  state?: string;
  challenge?: string;
}

let user: auth.OAuth2User | null = null;

const getUser = async () => {
  if (!user) {
    const { token } = (await getPlatformTokens()) ?? {};
    user = new auth.OAuth2User({
      client_id: process.env.X_CLIENT_ID as string,
      client_secret: process.env.X_CLIENT_SECRET as string,
      callback: "http://localhost:3000/api/auth/twitter/callback",
      scopes: ["tweet.read", "users.read", "follows.read"],
      token: token ? JSON.parse(token) : undefined,
    });
  }
  return user;
};

let client: Client | null = null;

export const getClient = async () => {
  if (!client) client = new Client(await getUser());
  return client;
};

export const generateAuthURL = async () => {
  const state = randomBytes(12).toString("hex");
  const challenge = randomBytes(12).toString("hex");
  await updatePlatformTokens({
    state,
    challenge,
  });
  const user = await getUser();
  return user.generateAuthURL({
    state,
    code_challenge_method: "plain",
    code_challenge: challenge,
  });
};

export const handleAuthCode = async (code: string) => {
  const user = await getUser();
  const { state, challenge } = (await getPlatformTokens()) ?? {};
  if (state && challenge) {
    user.generateAuthURL({
      state,
      code_challenge_method: "plain",
      code_challenge: challenge,
    });
    const { token } = await user.requestAccessToken(code);
    await updatePlatformTokens({
      token: JSON.stringify(token),
    });
  }
};

// Import your Supabase client

// export const getPlatformTokens = async () => {
//   const { data, error } = await supabase.from("platform").select("*").eq("id", "tokens").single();

//   if (error) {
//     console.error(error);
//     return null;
//   }

//   return data as PlatformTokens;
// };

// export const updatePlatformTokens = async (tokens: Partial<PlatformTokens>) => {
//   const { error } = await supabase.from("platform").upsert({ id: "tokens", ...tokens });

//   if (error) {
//     console.error(error);
//   }
// };

const tokensFilePath = path.resolve("tokens.json");

export const getPlatformTokens = async (): Promise<PlatformTokens | null> => {
  try {
    const data = fs.readFileSync(tokensFilePath, "utf8");
    return JSON.parse(data) as PlatformTokens;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updatePlatformTokens = async (tokens: Partial<PlatformTokens>) => {
  try {
    const existingTokens = await getPlatformTokens();
    const updatedTokens = { ...existingTokens, ...tokens };
    fs.writeFileSync(tokensFilePath, JSON.stringify(updatedTokens, null, 2));
  } catch (error) {
    console.error(error);
  }
};

// export const authClient = new auth.OAuth2User({
//   client_id: process.env.X_CLIENT_ID as string,
//   client_secret: process.env.X_CLIENT_SECRET as string,
//   callback: "http://localhost:3000/api/auth/twitter/callback",
//   scopes: ["tweet.read", "users.read", "follows.read"],
// });

// export const client = new Client(authClient);
