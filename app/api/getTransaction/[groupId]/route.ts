import { transactionTable } from "@/utils/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params;
        if (groupId) {
            const data = await transactionTable.findMany({
                where: {
                    groupId: groupId,
                    date: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
                orderBy: {
                    date: "desc",
                },
                select: {
                    id: true,
                    description: true,
                    amount: true,
                    date: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            maxAmount: true,
                            restAmount: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            if (data) {
                return Response.json(data, { status: 200 });
            } else {
                return Response.json(
                    { message: "Failed to fetch transaction" },
                    { status: 500 },
                );
            }
        }
    } catch (error) {
        return Response.json({ message: "Failed to fetch transaction" }, { status: 500 });
    }
}
