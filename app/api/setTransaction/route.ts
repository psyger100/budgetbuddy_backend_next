import { NextRequest } from "next/server";
import {
    categoryTable,
    transactionTable,
    userOnGroupsTable,
} from "../../../utils/prisma";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const addTransaction: {
        description: string;
        amount: number;
        transactionOwner: string;
        categoryId: string;
        groupId: string;
    } = data.addTransaction;
    addTransaction.amount = +addTransaction.amount;
    try {
        await categoryTable.update({
            where: {
                id: addTransaction.categoryId,
            },
            data: {
                restAmount: {
                    decrement: +addTransaction.amount,
                },
            },
        });
    } catch (error: any) {
        console.log(error.message);
        return Response.json({ message: "Failed to add transaction" }, { status: 500 });
    }
    try {
        const userInGroupId = await userOnGroupsTable.findFirst({
            where: {
                userId: addTransaction.transactionOwner,
                groupId: addTransaction.groupId,
            },
        });
        if (userInGroupId) {
            await userOnGroupsTable.update({
                where: {
                    id: userInGroupId.id,
                },
                data: {
                    restAmount: {
                        decrement: +addTransaction.amount,
                    },
                },
            });
        }
    } catch (error: any) {
        console.log(error.message);
        await categoryTable.update({
            where: {
                id: addTransaction.categoryId,
            },
            data: {
                restAmount: {
                    increment: +addTransaction.amount,
                },
            },
        });
        console.log(error.message);

        return Response.json({ message: "Failed to add transaction" }, { status: 500 });
    }
    try {
        await transactionTable.create({
            data: addTransaction,
        });
    } catch (error: any) {
        const userInGroupId = await userOnGroupsTable.findFirst({
            where: {
                userId: addTransaction.transactionOwner,
                groupId: addTransaction.groupId,
            },
        });
        if (userInGroupId) {
            await userOnGroupsTable.update({
                where: {
                    id: userInGroupId.id,
                },
                data: {
                    restAmount: {
                        increment: +addTransaction.amount,
                    },
                },
            });
        }
        console.log(error.message);
        return Response.json({ message: "Failed to add transaction" }, { status: 500 });
    }

    return Response.json({ message: "Transaction added" }, { status: 200 });
}
