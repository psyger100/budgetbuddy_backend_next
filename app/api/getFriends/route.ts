import { friendTable } from "@/utils/prisma";

export async function GET(request: Request) {
    try {
        const current_user = request.headers.get("current_user");
        const current_user_id = JSON.parse(current_user as string).payload.id;
        const data = await friendTable.findMany({
            where: {
                userId: current_user_id,
                isAccepted: true,
            },
            select: {
                friend: {
                    select: {
                        name: true,
                        email: true,
                        id: true,
                        avatar_url: true || "",
                    },
                },
            },
        });
        if (data) {
            return Response.json(data, { status: 200 });
        }
        return Response.json({ message: "Error getting friends" }, { status: 500 });
    } catch (error) {
        return Response.json({ message: "Error getting friends" }, { status: 500 });
    }
}
