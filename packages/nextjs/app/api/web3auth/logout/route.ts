import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json("success", { status: 200 });
    response.cookies.delete("address");
    response.cookies.delete("web3jwt");
    return response;
}
