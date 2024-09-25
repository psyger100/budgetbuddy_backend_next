import { NextRequest, NextResponse } from "next/server";
import { categoryTable } from "../../../../utils/prisma";

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params;
        const data = await categoryTable.findMany({
            where: {
                groupId: groupId,
            },
        });
        if (data) {
            return NextResponse.json(data, { status: 200 });
        } else {
            return NextResponse.json(
                { error: "Failed to fetch category" },
                { status: 500 },
            );
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}
