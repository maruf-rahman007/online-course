import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';


export const reviewStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id, action } = req.params;

        if (typeof action !== "string") {
            return res.status(400).json({ message: "Invalid action" });
        }

        if (!["accept", "reject"].includes(action)) {
            return res.status(400).json({ message: "Invalid action value" });
        }

        const updateUser = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                status: action === "accept" ? "active" : "rejected",
            },
        });

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


        if (!dbUsers) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(dbUsers);
    } catch (error) {
        console.error('Get ME error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
