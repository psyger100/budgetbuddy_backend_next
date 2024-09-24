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
    } catch (error) {
        return Response.json({ message: "Invalid user data" }, { status: 400 });
    }
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
        console.log(data);
        return Response.json(data, { status: 200 });
    }
    return Response.json({ message: "No Gruops found " }, { status: 404 });
}
