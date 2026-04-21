import prisma from "../db";

export async function createNewRole({ name, permissions }: any) {
    const newRole = await prisma.customRole.create({
        data: {
            name,
            permissions
        }
    });

    return newRole;
}

export async function getAllCustomRolesDB() {
    const roles = await prisma.customRole.findMany({
        include: {
            users: true
        }
    });

    return roles;
}

export async function deleteCustomRoleDB(id: number) {
    await prisma.customRole.delete({
        where: {
            id: Number(id)
        }
    });

    return;
}

export async function updateCustomRoleDB({ id, name, permissions }: any) {
    const updatedRole = await prisma.customRole.update({
        where: {
            id: Number(id)
        },
        data: {
            name,
            permissions
        }
    });

    return updatedRole;
}