import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils";

export function middleware(request: NextRequest) {
  // Create a response object
  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*"); // Adjust as necessary
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");

  // Handle OPTIONS method for CORS preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  const address = request.cookies.get("address")?.value || "";
  const web3jwt = request.cookies.get("web3jwt")?.value || "";
  const validToken = verifyToken(web3jwt, address);

  // would be good to maybe verify web3jwt here, but error w/ edge functions
  if (!web3jwt || !validToken) {
    if (!request.url.includes("/")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  console.log("middleware");
  // Continue with the response for non-OPTIONS requests
  return response;
}

// Apply the middleware to all paths
export const config = {
  matcher: "/api/mint/:walletAddress*",
};
