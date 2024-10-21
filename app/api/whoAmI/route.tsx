import { userTable } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

interface currentUserType {
    payload: {
        id: string;
        name: string;
        userName: string;
        email: string;
        avatar_url: any;
    };
}
export async function GET(request: NextRequest) {
    const currentUserHeader: any = request.headers.get("current_user");
    try {
        const new_info = await userTable.findUnique({
            where: {
                id: JSON.parse(currentUserHeader).payload.id,
            },
        });

        return Response.json(
            {
                userInformation: {
                    id: new_info?.id,
                    userName: new_info?.userName,
                    name: new_info?.name,
                    email: new_info?.email,
                    avatar_url: new_info?.avatar_url,
                },
            },
            { status: 200 },
        );
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
