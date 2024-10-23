import { categoryTable, groupTable, userOnGroupsTable } from "@/utils/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params;

        if (groupId) {
            const records = await categoryTable.findMany({
                where: {
                    groupId: groupId,
                },
            });

            const updatePromises = records.map((record) => {
                return categoryTable.update({
                    where: { id: record.id },
                    data: { restAmount: record.maxAmount },
                });
            });

            await Promise.all(updatePromises);
            const userRecords = await userOnGroupsTable.findMany({
                where: {
                    groupId: groupId,
                },
            });
            const alluserPromises = userRecords.map((record) => {
                return userOnGroupsTable.update({
                    where: {
                        id: record.id,
                    },
                    data: { restAmount: record.maxAmount },
                });
            });
            await Promise.all(alluserPromises);

            await groupTable.update({
                where: {
                    id: groupId,
                },
                data: {
                    lastReset: new Date(),
                },
            });

            return NextResponse.json({ error: "All data reset" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "GroupId not found" }, { status: 404 });
        }
    } catch (error: any) {
        console.log("throwing error");

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
