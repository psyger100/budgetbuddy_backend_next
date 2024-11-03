import { userTable } from "@/utils/prisma";
import { stat } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(request: Request) {
    try {
        const { searchUser } = await request.json();
        const isValidEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        const query = isValidEmail(searchUser)
            ? { email: searchUser }
            : { userName: searchUser };

        const data = await userTable.findUnique({
            where: query,
            select: {
                id: true,
                email: true,
                userName: true,
                avatar_url: true,
            },
        });

        return Response.json({ user: data }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
    }
}
