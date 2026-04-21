import prisma from "../db";
import { Role, Status } from "@prisma/client";

export async function addNewUserDB({ name, email, hashedPassword, role }: any) {
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role:     role as Role || Role.STUDENT,
            status:   Status.PENDING
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    });

    return newUser;
}

export async function checkExistingUser(email: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    return existingUser;
}

export async function checkExistingUserById(id: number) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    return existingUser;
}