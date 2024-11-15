import { groupTable, transactionTable } from "@/utils/prisma";
import { NextRequest } from "next/server";

interface User {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    maxAmount: number;
    restAmount: number;
}

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: Date | null;
    category: Category;
    user: User;
}

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
    try {
        const { groupId } = params;

        if (groupId) {
            const groupInfo = await groupTable.findUnique({
                where: {
                    id: groupId,
                },
            });

            const data: Transaction[] = await transactionTable.findMany({
                where: {
                    groupId: groupId,
                    date: {
                        gte: groupInfo?.lastReset ?? undefined,
                        // gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
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
