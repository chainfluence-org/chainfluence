import Client, { auth } from "twitter-api-sdk";

export const authClient = new auth.OAuth2User({
  client_id: process.env.X_CLIENT_ID as string,
  client_secret: process.env.X_CLIENT_SECRET as string,
  callback: "http://localhost:3000/api/auth/twitter/callback",
  scopes: ["tweet.read", "users.read", "follows.read"],
});

export const client = new Client(authClient);
