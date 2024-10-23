import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient().$extends(withAccelerate());

export const transactionTable = prisma.transaction;
export const categoryTable = prisma.category;
export const userTable = prisma.user;
export const userOnGroupsTable = prisma.userOnGroups;
export const friendTable = prisma.friend;
export const groupTable = prisma.group;
