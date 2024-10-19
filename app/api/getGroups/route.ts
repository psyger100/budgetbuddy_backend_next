import { NextRequest } from "next/server";
import { userOnGroupsTable } from "../../../utils/prisma";
import { CurrentUserType } from "../../../current_user";

export async function GET(request: NextRequest) {
    const currentUserHeader = request.headers.get("current_user");
    if (!currentUserHeader) {
        return Response.json({ message: "User not authenticated" }, { status: 401 });
    }

    let current_user: CurrentUserType;
    try {
        current_user = JSON.parse(currentUserHeader) as CurrentUserType;
        const data = await userOnGroupsTable.findMany({
            where: {
                userId: current_user.payload.id.toString(),
            },
            select: {
                group: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (data) {
            if (data.length != 0) {
                return Response.json(data, { status: 200 });
            }
            return Response.json(
                { message: "You are not in any group." },
                { status: 200 },
            );
        }
    } catch (error) {
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }

    // return Response.json({ message: "No Groups found " }, { status: 404 });
}
