import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { updateUserInfoDB } from '../models/user';



export const updateUserInfo = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;
        const updatedInfo = req.body;

        const updatedUserInfo = await updateUserInfoDB({updatedInfo,id});

        res.status(200).json({
            message:"User information Updated Successful",
            updatedUserInfo
        })

    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};