import { categoryTable, groupTable } from "../../../utils/prisma";

export async function POST(request: Request) {
    const data = await request.json();
    const setCategory: {
        groupId: string;
        name: string;
        maxAmount: Number;
    } = data.setCategory;
    setCategory.maxAmount = +setCategory.maxAmount;

    // TODO: check if the group exists
    const group = await groupTable.findUnique({
        where: {
            id: setCategory.groupId,
        },
    });

    if (group) {
        const dbData = await categoryTable.create({
            data: {
                name: setCategory.name,
                maxAmount: +setCategory.maxAmount,
                restAmount: +setCategory.maxAmount,
                groupId: group.id,
            },
        });
        if (dbData) {
            return Response.json(
                { message: "Category created successfully" },
                { status: 200 },
            );
        } else {
            return Response.json({ message: "Error creating category" }, { status: 500 });
        }
    } else {
        return Response.json({ message: "Group not found" }, { status: 404 });
    }
}
