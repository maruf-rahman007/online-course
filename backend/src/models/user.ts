import prisma from "../db";
import {  Status } from "@prisma/client"; // ✅ import enums


export async function updateUserStatusDB({ id, action }: any) {
  const updateUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      status: action === "accept" ? Status.ACTIVE : Status.SUSPENDED,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
  return updateUser;
}


export async function getPendingUsersDB() {
  const dbUsers = await prisma.user.findMany({
    where: {
      status: {
        in: [Status.PENDING, Status.SUSPENDED],
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


export async function updateUserInfoDB({ updatedInfo, id }: any) {
  const updatedUserInfo = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name:   updatedInfo.name,
      email:  updatedInfo.email,
      
      role:   updatedInfo.role ,
      status: updatedInfo.status as Status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
  return updatedUserInfo;
}


export async function getPendingCoursesDB() {
  const dbCourses = await prisma.course.findMany({  
    where: {
      status: {
        
        in: ["PENDING", "DRAFT"],
      },
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return dbCourses;
}


export async function suspendUserDB(id: number) {
  const updatedUserInfo = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      status: Status.SUSPENDED, 
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
  return updatedUserInfo;
}


export async function reactivateUserDB(id: number) {
  const updatedUserInfo = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      status: Status.ACTIVE, 
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
  return updatedUserInfo;
}


export async function addNewCustomRoleDB({ id, role }: any) {
  const newRole = await prisma.userCustomRole.create({
    data: {
      userId: Number(id),
      roleId: Number(role),
    },
    include: {
      role: true,  
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return newRole;
}


export async function getCustomRolesDB(id: any) {
  const customRoles = await prisma.userCustomRole.findMany({
    where: {
      userId: Number(id), 
    },
    include: {
      role: true, 
    },
  });
  return customRoles;
}


export async function getUserInfoDB(id: any) {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      customRoles: {          
        include: {
          role: true,
        },
      },
    },
  });

  return userInfo;
}