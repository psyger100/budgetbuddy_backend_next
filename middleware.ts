import { NextRequest, NextResponse } from "next/server";
import { userTable } from "./utils/prisma";
import { generateAccessToken } from "./utils/Tokens";
import jwt from "jsonwebtoken";
import * as jose from "jose";
export async function middleware(request: NextRequest, response: NextResponse) {
    const accessToken = request.headers.get("accessToken");
    const refreshToken = request.headers.get("refreshToken");
    if (!accessToken && !refreshToken) {
        return NextResponse.json({ message: "Login Required!!!" }, { status: 401 });
    } else {
        try {
            try {
                const decoded_value = await jose.jwtVerify(
                    accessToken?.toString() as string,
                    new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET as string),
                );

                const accessTokenDbVerification = await userTable.findUnique({
                    where: {
                        id: decoded_value.payload.id as string,
                    },
                });
                if (refreshToken === accessTokenDbVerification?.refreshToken) {
                    delete (decoded_value as { iat?: number })?.iat;
                    delete (decoded_value as { exp?: number })?.exp;
                    request.headers.set("current_user", JSON.stringify(decoded_value));
                    console.log("Next function called");

                    return NextResponse.next({
                        request: request,
                    });
                }
            } catch (error) {}
        } catch (error) {
            return NextResponse.json({ message: "Login Required" }, { status: 401 });
        }
    }
}
export const config = {
    matcher: "/api/sayHello",
};
