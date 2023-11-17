import { SignJWT, jwtVerify } from "jose";
import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7); // 7-character random string

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function signToken(payload: any, options: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET));

  return token;
}

interface UserJwtPayload {
  jti: string;
  iat: number;
}

//https://github.com/oceanprotocol/tokengated-next-chatgpt/blob/main/lib/utils.ts
// todo:: should verify that the address is the signer?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function verifyToken(token: string, address: string) {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET));
    return verified.payload as UserJwtPayload;
  } catch (err) {
    return jsonResponse(401, { error: { message: "Your token has expired." } });
  }
}

export function jsonResponse(status: number, data: any, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });
}

export function getCookie(name: string): string | null {
  if (!document) return null;

  const cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].trim();

    if (cookiePair.startsWith(name + "=")) {
      return decodeURIComponent(cookiePair.substring(name.length + 1));
    }
  }

  return null;
}
