import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { getServiceRoleServerSupabaseClient } from "~~/services/supabase/client";
import { signToken } from "~~/utils";

export async function POST(req: Request) {
  const srSupabase = getServiceRoleServerSupabaseClient();
  const json = await req.json();
  const { address, signedMessage, nonce } = json;

  // 1. Verify the signed message matches the requested address
  const message = process.env.NEXT_PUBLIC_WEB3AUTH_MESSAGE + nonce;

  // todo: swap for https://viem.sh/docs/actions/public/verifyMessage.html
  const recoveredAddress = ethers.verifyMessage(message, signedMessage);

  if (recoveredAddress !== address) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
  }

  try {
    // 2. Select * from public.user table to get nonce
    const { data: user, error: userError } = await srSupabase.from("users").select("*").eq("address", address).single();

    if (user && !userError) {
      // 3. Verify the nonce included in the request matches what's already in public.users table for that address
      if (user?.auth.genNonce !== nonce) {
        return NextResponse.json({ error: "Nonce verification failed" }, { status: 401 });
      }

      let finalAuthUser = null;
      // 2. Select * from public.auth_users view where address matches
      const { data: authUser, error: authUserError } = await srSupabase
        .from("auth_users")
        .select("*")
        .eq("raw_user_meta_data->>address", address)
        .single();

      if (!authUser || authUserError) {
        // 4. If there's no auth.users.id for that address
        const { data: newUser, error: newUserError } = await srSupabase.auth.admin.createUser({
          email: address + process.env.NEXT_PUBLIC_APP_DOMAN,
          user_metadata: { address: address },
          email_confirm: true,
        });

        if (newUserError || !newUser) {
          return NextResponse.json({ error: "Failed to create auth user" }, { status: 500 });
        }

        // response object is different from auth.users view
        finalAuthUser = newUser.user;
      } else {
        // selection from auth.users view is the user, assign
        finalAuthUser = authUser;
      }

      // 5. Update public.users.id with auth.users.id
      await srSupabase
        .from("users")
        .update([
          {
            id: finalAuthUser?.id,
            auth: {
              genNonce: nonce,
              lastAuth: new Date().toISOString(),
              lastAuthStatus: "success",
            },
          },
        ])
        .eq("address", address)
        .select();

      // 1 day
      const ttl = 86400;

      if (!ttl) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }

      // 6. We sign the token and return it to client
      const token = await signToken(
        {
          userId: finalAuthUser?.id,
          address: address,
          sub: user.id,
          aud: "authenticated",
          ttl,
        },
        { expiresIn: `${ttl}s` },
      );

      const response = NextResponse.json("success", { status: 200 });
      response.cookies.set("address", address);
      response.cookies.set("web3jwt", token);
      return response;
    }

    return NextResponse.json({ error: userError?.message || "Internal Server Error" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
