import { userTable } from "@/utils/prisma";

export async function POST(request: Request) {
    const currentUser = request.headers.get("current_user");
    let current_user_id;
    if (currentUser) {
        current_user_id = JSON.parse(currentUser).payload.id;
    }
    try {
        if (current_user_id) {
            const data = await userTable.update({
                where: {
                    id: current_user_id,
                },
                data: {
                    refreshToken: null,
                },
            });
            if (data) {
                return Response.json({ message: "Logged out" }, { status: 200 });
            }
        }
        return Response.json({ message: "Error logging out" }, { status: 500 });
    } catch (error) {
        return Response.json({ message: "Error logging out" }, { status: 500 });
    }
}
