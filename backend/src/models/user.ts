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

export async function suspendUserDB(id: number) {
    
    const updatedUserInfo = await prisma.user.update({
        where:{
            id:Number(id)
        },
        data:{
            status:"suspended"
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

export async function reactivateUserDB(id: number) {
    
    const updatedUserInfo = await prisma.user.update({
        where:{
            id:Number(id)
        },
        data:{
            status:"active"
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

export async function addNewCustomRoleDB({id,role}:any) {
    const newRole = await prisma.userCustomRole.create({
        data: {
            userId: Number(id),
            roleId: Number(role)
        }
    })

    return newRole;
}


export async function getCustomRolesDB(id:any) {
    const customRole = await prisma.userCustomRole.findMany({
        where: {
            userId:id
        }
    })
    return customRole;
}

export async function getUserInfoDB(id:any) {
    const userInfo = await prisma.user.findUnique({
        where:{
            id:Number(id)
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    })

    return userInfo;
}