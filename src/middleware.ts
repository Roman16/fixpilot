import {NextRequest, NextResponse} from "next/server";

const PUBLIC_ROUTES = ["/login", "/registration"];

export function middleware(req: NextRequest) {
    try {
        const {pathname} = req.nextUrl;

        if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
            return NextResponse.next();
        }

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    } catch (error) {
        console.log(error);
    }
}

export const config = {
    matcher: [
        "/account/:path*",
        "/clients/:path*",
    ],
};