import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';
import { addCoursesDB, couseStatusDB, findInstructorsCoursesDB, findValidCourseDB } from '../models/courses';




export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user;
        console.log("Here is user in dashboard ", user);
        if (!user) {
            res.status(404).json({ message: 'User not found in token' });
            return;
        }

        if (user.status != "active") {
            res.status(403).json({
                message: "Account needs to be approved please check you status or login again"
            })
        }
        console.log("Searching for courses by " + user.id);


        const courses = await findInstructorsCoursesDB(user);
        console.log('found course by user' + courses);
        res.status(200).json({
            courses
        })

    } catch (error) {
        console.error('Can not fetch courses :', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const addCourses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user;
        console.log("Here is user ", user);
        if (!user) {
            res.status(404).json({ message: 'User not found in token' });
            return;
        }
        if (user.status != "active") {
            res.status(403).json({
                message: "Account needs to be approved please check you status or login again"
            })
        }
        const course = await addCoursesDB(user);

        res.status(200).json({
            message: "Course added successful",
            course
        })

    } catch (error) {
        console.error('Error while adding courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const courseReviewSubmit = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.body;
        const course = await findValidCourseDB(id);

        if (!course) {
            res.status(400).json({
                message: "Invalid Course"
            })
        }
        console.log("All good");

        if (course?.status != "publish") {
            const change = "pending";
            const updateStatus = await couseStatusDB({ id, change })
            console.log("All good");
            res.status(200).json({
                message: "Course under admin review",
                updateStatus

            })
        }

    } catch (error) {
        console.error('Error while adding courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};