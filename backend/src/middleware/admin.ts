import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRole } from '../models/rolecheck';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
        status:string;
    };
}

export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("Reached auth middlewire");
    const authHeader = req.header('Authorization');
    console.log(authHeader);
    if (!authHeader) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            status:decoded.status
        };

        const actualRole = await getRole(req.user.id);

        if (req.user.role == "admin" && actualRole == "admin" ) {
            next();
        }
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid for admin access' });
    }
};
