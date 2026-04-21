import prisma from "../db";

export async function updateUserStatusDB({ id, action }: any) {
    const updateUser = await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            status: action === "accept" ? "active" : "rejected",
        },
    });
    return updateUser;
}


export async function getPendingUsersDB() {
    const dbUsers = await prisma.user.findMany({
        where: {
            status: {
                in: ["pending", "rejected"],
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });

    return dbUsers;
}


export async function updateUserInfoDB({updatedInfo,id}:any) {
    console.log(updatedInfo);
    console.log(id);
    const updatedUserInfo = await prisma.user.update({
        where:{
            id:Number(id)
        },
        data:{
            name:updatedInfo.name,
            email:updatedInfo.email,
            role:updatedInfo.role,
            status:updatedInfo.status
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    })
    return updatedUserInfo;
}



export async function getPendingCoursesDB() {
    const dbCourses = await prisma.courses.findMany({
        where: {
            status: {
                in: ["pending", "rejected"],
            },
        }
    });

    return dbCourses;
}