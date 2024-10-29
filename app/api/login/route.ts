import { userTable } from "@/utils/prisma";
import { generateAccessToken, generateRefreshToken } from "@/utils/Tokens";
import argon2 from "argon2";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    try {
        const user = await userTable.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }
        const passwordMatch = await argon2.verify(user.password, password);
        if (!passwordMatch) {
            return Response.json({ message: "Invalid password" }, { status: 401 });
        }
        delete (user as { refreshToken?: string })?.refreshToken;
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        const user_data = await userTable.update({
            where: {
                id: user.id,
            },
            data: {
                refreshToken: refreshToken,
            },
        });

        return Response.json({
            userInformation: {
                id: user_data?.id,
                userName: user_data?.userName,
                name: user_data?.name,
                email: user_data?.email,
                avatar_url: user_data?.avatar_url,
            },
            setAccessToken: accessToken,
            setRefreshToken: refreshToken,
        });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: 401 });
    }
}
