import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { addNewCustomRoleDB, getCustomRolesDB, getUserInfoDB, reactivateUserDB, suspendUserDB, updateUserInfoDB } from '../models/user';
import { checkExistingUser, checkExistingUserById } from '../models/auth';



export const updateUserInfo = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;
        const updatedInfo = req.body;

        const updatedUserInfo = await updateUserInfoDB({ updatedInfo, id });

        res.status(200).json({
            message: "User information Updated Successful",
            updatedUserInfo
        })

    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const suspendUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        const updatedUserInfo = await suspendUserDB(id);

        res.status(200).json({
            message: "User is suspended",
            updatedUserInfo
        })

    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const reactivateUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        const updatedUserInfo = await reactivateUserDB(id);

        res.status(200).json({
            message: "User is Reactivated",
            updatedUserInfo
        })

    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const assignNewRole = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const role = req.params.role;

        const existingUser = await checkExistingUserById(id);

        if (existingUser) {
            const newRole = await addNewCustomRoleDB({ id, role });
            res.status(200).json({
                message: "New Role added",
                newRole
            })
        }
        
    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const getUserInfo = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        const existingUser = await checkExistingUserById(id);

        // get all information on user
        const userInfo = getUserInfoDB(id)
        const customRoles = getCustomRolesDB(id)

        res.json({
            userInfo,
            customRoles
        })
        
    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
