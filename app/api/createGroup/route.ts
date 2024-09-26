import { groupTable, userOnGroupsTable } from "@/utils/prisma";

export async function POST(request: Request) {
    try {
        let info: {
            createGroup: {
                name: string;
                adminBudget: Number | string;
                members: {
                    id: String;
                    maxAmount: String | number;
                    restAmount: String | number;
                }[];
            };
        } = await request.json();

        const current_user = request.headers.get("current_user");

        const current_user_id = JSON.parse(current_user as string).payload.id;
        const groupCreation = await groupTable.create({
            data: {
                name: info.createGroup.name,
            },
        });
        if (groupCreation) {
            const users = info.createGroup.members.map(
                (item: {
                    id: String;
                    maxAmount: String | number;
                    restAmount: String | number;
                }) => ({
                    groupId: groupCreation.id,
                    userId: item.id,
                    maxAmount: +item.maxAmount,
                    restAmount: +item.restAmount,
                }),
            );
            users.push({
                groupId: groupCreation.id,
                userId: current_user_id,
                maxAmount: +info.createGroup.adminBudget,
                restAmount: +info.createGroup.adminBudget,
            });

            if (users.length > 0) {
                const userOnGroups = await userOnGroupsTable.createMany({
                    // @ts-ignore
                    data: users,
                });
                if (userOnGroups) {
                    return Response.json(
                        { message: "Group created successfully" },
                        { status: 200 },
                    );
                }
            }
        }
        return Response.json({ message: "Error creating group" }, { status: 500 });
    } catch (error) {
        return Response.json({ message: "Error creating group" }, { status: 500 });
    }
}
