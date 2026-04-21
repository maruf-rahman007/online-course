import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRole } from '../models/rolecheck';
import { Role, Status } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: Role;
    status: Status;
  };
}

export const authenticateInstructor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    res.status(401).json({ message: 'Token not provided' });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;

    req.user = {
      id:     decoded.id,
      name:   decoded.name,
      email:  decoded.email,
      role:   decoded.role   as Role,
      status: decoded.status as Status,
    };

    if (!req.user.id || !req.user.role || !req.user.status) {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    if (req.user.status !== Status.ACTIVE) {
      res.status(403).json({ message: 'Account is not active' });
      return;
    }

    const actualRole = await getRole(req.user.id);

    if (!actualRole || actualRole !== Role.INSTRUCTOR) {
      res.status(403).json({ message: 'Access denied: instructor role required' });
      return;
    }

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};