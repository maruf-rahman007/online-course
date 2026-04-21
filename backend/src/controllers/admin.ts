import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';
import { getPendingCoursesDB, getPendingUsersDB, updateUserStatusDB } from '../models/user';
import { couseStatusDB } from '../models/courses';


export const reviewUserStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id, action } = req.params;

        if (typeof action !== "string") {
            return res.status(400).json({ message: "Invalid action" });
        }

        if (!["accept", "reject"].includes(action)) {
            return res.status(400).json({ message: "Invalid action value" });
        }

        const updateUser = await updateUserStatusDB({id,action});

        return res.status(200).json({
            message: "User approval successful",
            user: updateUser,
        });

    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user;
        console.log("Here is user ", user);
        if (!user) {
            res.status(404).json({ message: 'User not found in token' });
            return;
        }

        const dbUsers = await getPendingUsersDB();
        const dbCourses = await getPendingCoursesDB();

        res.json({
            dbUsers,
            dbCourses
        });
    } catch (error) {
        console.error('Get ME error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const reviewCourseStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id, action } = req.params;
        console.log(id);
        console.log(action);
        if (typeof action !== "string") {
            return res.status(400).json({ message: "Invalid action" });
        }

        if (!["publish", "reject"].includes(action)) {
            return res.status(400).json({ message: "Invalid action value" });
        }
        const change = action;
        const updateCourse = await couseStatusDB({id,change});

        return res.status(200).json({
            message: "Course approval successful",
            user: updateCourse,
        });

    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};