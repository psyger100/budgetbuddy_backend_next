import { NextRequest, NextResponse } from "next/server";
import { userOnGroupsTable } from "../../../../utils/prisma";

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params;
        const data = await userOnGroupsTable.findMany({
            where: {
                groupId: groupId,
            },
            select: {
                id: true,
                userId: true,
                maxAmount: true,
                restAmount: true,
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (data) {
            return NextResponse.json(data, { status: 200 });
        } else {
            return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
    }
}
