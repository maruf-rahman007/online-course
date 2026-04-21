import prisma from "../db";

export async function createNewRole({name,permission}:any) {
    const newrole = await prisma.customRole.create({
        data:{
            name,
            permission
        }
    })

    return newrole;
}

