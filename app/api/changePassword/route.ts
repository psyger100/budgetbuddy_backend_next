import { userTable } from "@/utils/prisma";
import argon2 from "argon2";

export async function PATCH(request: Request) {
    try {
        const { oldPassword, newPassword, stayLoggedIn } = await request.json();
        const current_user: any = request.headers.get("current_user");

        try {
            const current_user_id = JSON.parse(current_user as string).payload.id;

            const user = await userTable.findUnique({
                where: {
                    id: current_user_id,
                },
            });
            if (!user) {
                return Response.json({ message: "User not found" }, { status: 404 });
            }
            const passwordVerified = await argon2.verify(user.password, oldPassword);
            let updatedUser;
            if (passwordVerified && stayLoggedIn == false) {
                updatedUser = await userTable.update({
                    where: {
                        id: current_user_id,
                    },
                    data: {
                        password: await argon2.hash(newPassword),
                        refreshToken: null,
                    },
                });
                return Response.json(
                    { message: "password changed successfully", logout: true },
                    { status: 200 },
                );
            } else {
                updatedUser = await userTable.update({
                    where: {
                        id: current_user_id,
                    },
                    data: {
                        password: await argon2.hash(newPassword),
                    },
                });
                return Response.json(
                    { error: "password changed successfully" },
                    { status: 200 },
                );
            }
        } catch (error) {
            if (error instanceof Error) {
                return Response.json({ error: error.message }, { status: 500 });
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json({ error: "Server Error." }, { status: 500 });
    }
}
