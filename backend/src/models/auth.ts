import prisma from "../db";

export async function addNewUserDB({ name, email, hashedPassword, role }: any) {
    const addNewUserDBser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'USER',
            status: 'pending'
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    });

    return addNewUserDB;
}


export async function checkExistingUser(email: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    return existingUser;
}

export async function checkExistingUserById(id:number) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    return existingUser;
}