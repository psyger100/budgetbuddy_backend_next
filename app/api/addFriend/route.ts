import { friendTable, userTable } from "@/utils/prisma";

export async function POST(request: Request) {
    const current_user = request.headers.get("current_user");
    const current_user_id = JSON.parse(current_user as string).payload.id;
    const { addFriend } = await request.json();

    try {
        const user = await userTable.findUnique({
            where: {
                email: addFriend,
            },
        });
        if (user) {
            const reqSent = await friendTable.create({
                data: {
                    userId: current_user_id,
                    friendId: user.id,
                    isAccepted: false,
                },
            });
            if (reqSent) {
                return Response.json({ message: "Request Sent" }, { status: 200 });
            } else {
                return Response.json(
                    { message: "Error sending request" },
                    { status: 500 },
                );
            }
        }
        return Response.json({ message: "User not found" }, { status: 404 });
    } catch (error) {
        return Response.json({ message: "Error sending request" }, { status: 500 });
    }
}
