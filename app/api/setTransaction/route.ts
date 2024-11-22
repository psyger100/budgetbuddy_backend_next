import { NextRequest } from "next/server";
import {
    categoryTable,
    TransactionEntriesTable,
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
        splitted?: boolean;
        TransactionEntries?: {
            Payer: string;
            Receiver: string;
            amount: number;
        }[];
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

        return Response.json({ message: "Failed to add transaction" }, { status: 500 });
    }
    try {
        console.log(addTransaction);
        console.log(addTransaction.splitted);

        if (!addTransaction.splitted) {
            await transactionTable.create({
                data: {
                    description: addTransaction.description,
                    amount: addTransaction.amount,
                    splitted: addTransaction.splitted,
                    categoryId: addTransaction.categoryId,
                    groupId: addTransaction.groupId,
                    transactionOwner: addTransaction.transactionOwner,
                },
            });
        } else {
            const transactionTableData: {
                id: string;
                description: string;
                amount: number;
                splitted: boolean;
                categoryId: string;
                groupId: string;
                transactionOwner: string;
            } = await transactionTable.create({
                data: {
                    description: addTransaction.description,
                    amount: addTransaction.amount,
                    splitted: addTransaction.splitted,
                    categoryId: addTransaction.categoryId,
                    groupId: addTransaction.groupId,
                    transactionOwner: addTransaction.transactionOwner,
                },
            });

            try {
                addTransaction.TransactionEntries?.forEach(
                    async (elem: { Payer: string; Receiver: string; amount: number }) => {
                        try {
                            const transactionTableEntries: {
                                id: string;
                                transactionId: string;
                                Payer: string;
                                Receiver: string;
                                amount: number;
                            } = await TransactionEntriesTable.create({
                                data: {
                                    transactionId: transactionTableData.id,
                                    Payer: elem.Payer,
                                    Receiver: elem.Receiver,
                                    amount: elem.amount,
                                    groupId: transactionTableData.groupId,
                                },
                            });
                            console.log(
                                "this is transactionEntriesTable Entries ",
                                transactionTableEntries,
                            );
                        } catch (error) {
                            if (error instanceof Error) {
                                console.log(error.message);
                            }
                        }
                    },
                );
                return Response.json({ message: "Transaction added" }, { status: 200 });
            } catch (error) {
                if (transactionTableData) {
                    await transactionTable.delete({
                        where: {
                            id: transactionTableData.id,
                        },
                    });
                }
                if (error instanceof Error) {
                    return Response.json({ message: error.message }, { status: 500 });
                }
            }
        }
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

        return Response.json({ message: "Failed to add transaction" }, { status: 500 });
    }

    return Response.json({ message: "Transaction added" }, { status: 200 });
}
