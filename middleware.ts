import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/token";

interface AuthenticatedRequest extends NextRequest {
    user: {
        id: string;
    };
}

let redirectToLogin = false;
export async function middleware(req: NextRequest) {
    let token: string | undefined;

    if (req.cookies.has("token")) {
        token = req.cookies.get("token")?.value;
    } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
        token = req.headers.get("Authorization")?.substring(7);
    }

    if (req.nextUrl.pathname.startsWith("/login") && (!token || redirectToLogin))
        return;

    if (
        !token &&
        (req.nextUrl.pathname.startsWith("/api/users") ||
            req.nextUrl.pathname.startsWith("/api/auth/logout"))
    ) {
        return new NextResponse("You are not logged in. Please provide a token to gain access.", { status: 401 });
    }

    const response = NextResponse.next();

    try {
        if (token) {
            const { sub } = await verifyJWT<{ sub: string }>(token);
            response.headers.set("X-USER-ID", sub);
            (req as AuthenticatedRequest).user = { id: sub };
        }
    } catch (error) {
        redirectToLogin = true;
        if (req.nextUrl.pathname.startsWith("/api")) {
            return new NextResponse("Token is invalid or user doesn't exists", { status: 401 });
        }

        return NextResponse.redirect(
            new URL(`/login?${new URLSearchParams({ error: "badauth" })}`, req.url)
        );
    }

    const authUser = (req as AuthenticatedRequest).user;

    if (!authUser) {
        return NextResponse.redirect(
            new URL(
                `/login?${new URLSearchParams({
                    error: "badauth",
                    forceLogin: "true",
                })}`,
                req.url
            )
        );
    }

    if (req.url.includes("/login") && authUser) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return response;
}

export const config = {
    matcher: ["/order", "/login", "/api/auth/logout"],
};
