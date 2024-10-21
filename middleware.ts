import { NextRequest, NextResponse } from "next/server";
import { userTable } from "./utils/prisma";
import { generateAccessToken } from "./utils/Tokens";

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
                    delete (decoded_value.payload as { iat?: number })?.iat;
                    delete (decoded_value.payload as { exp?: number })?.exp;
                    delete (decoded_value.payload as { password?: string })?.password;
                    delete (decoded_value as { protectedHeader?: object })
                        ?.protectedHeader;
                    delete (decoded_value.payload as { refreshToken?: string })
                        ?.refreshToken;

                    request.headers.set("current_user", JSON.stringify(decoded_value));
                    return NextResponse.next({
                        request: request,
                    });
                } else {
                    return NextResponse.json(
                        { message: "Login Required" },
                        { status: 401 },
                    );
                }
            } catch (error) {
                const decoded_value = await jose.jwtVerify(
                    refreshToken?.toString() as string,
                    new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET as string),
                );
                const refreshTokenDbVerification = await userTable.findUnique({
                    where: {
                        id: decoded_value.payload.id as string,
                    },
                });
                if (refreshToken === refreshTokenDbVerification?.refreshToken) {
                    const accessToken = generateAccessToken({
                        id: refreshTokenDbVerification.id,
                        email: refreshTokenDbVerification.email,
                        username: refreshTokenDbVerification.userName,
                    });

                    request.headers.set("setAccessToken", accessToken.toString());
                    delete (decoded_value.payload as { iat?: number })?.iat;
                    delete (decoded_value.payload as { exp?: number })?.exp;
                    delete (decoded_value.payload as { password?: string })?.password;
                    delete (decoded_value as { protectedHeader?: object })
                        ?.protectedHeader;
                    delete (decoded_value.payload as { refreshToken?: string })
                        ?.refreshToken;
                    request.headers.set("current_user", JSON.stringify(decoded_value));
                    return NextResponse.next({
                        request: request,
                    });
                } else {
                    return NextResponse.json(
                        { message: "Login Required" },
                        { status: 401 },
                    );
                }
            }
        } catch (error) {
            return NextResponse.json({ message: "Login Required" }, { status: 401 });
        }
    }
}
export const config = {
    matcher: [
        "/api/sayHello",
        "/api/setTransaction",
        "/api/setCategory",
        "/api/getCategory",
        "/api/getTransaction",
        "/api/getUser",
        "/api/getGroups",
        "/api/logout",
        "/api/getFriends",
        "/api/createGroup",
        "/api/addFriend",
        "/api/whoAmI",
    ],
};
