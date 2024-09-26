import { userTable } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as argon2 from "argon2";

export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();
    const newUserData = body.signUp;

    try {
        const isUniqueEmail = await userTable.findUnique({
            where: {
                email: newUserData.email,
            },
        });
        const isUniqueUserName = await userTable.findUnique({
            where: {
                userName: newUserData.userName,
            },
        });

        if (!isUniqueEmail && !isUniqueUserName) {
            const newpassword = await argon2.hash(newUserData.password);
            if (newpassword) {
                const response = await userTable.create({
                    data: {
                        name: newUserData.name,
                        userName: newUserData.userName,
                        email: newUserData.email,
                        password: newpassword,
                    },
                });
                if (response) {
                    return Response.json({ message: "User Created" });
                }
            }
        } else {
            if (isUniqueEmail) {
                return Response.json({ message: "Email not available." });
            }
            if (isUniqueUserName) {
                return Response.json({ message: "UserName not available." });
            }
        }
    } catch (error) {
        return Response.json({ message: "User Creation Failed" });
    }
}
