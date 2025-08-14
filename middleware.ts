import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    if (token?.isBanned) {
        return NextResponse.redirect(new URL('/auth/login?error=banned', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile/:path*"],
};
