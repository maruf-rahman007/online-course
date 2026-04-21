import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';
import { addNewUserDB, checkExistingUser } from '../models/auth';

const generateToken = (user: { id: number; name: string; email: string; role: string; status:string }) => {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role, status:user.status },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
    );
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(req.body);

        if (!name || !email || !password) {
            res.status(400).json({ message: 'Name, email, and password are required' });
            return;
        }

        const existingUser = await checkExistingUser(email);
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await addNewUserDB({name,email,hashedPassword,role});

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await checkExistingUser(email);
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status:user.status
        });

        console.log("After successful login "+user.status);

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, status:user.status } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user;
        console.log(user);
        if (!user) {
            res.status(404).json({ message: 'User not found in token' });
            return;
        }

        // We can also fetch the latest from DB if needed, but returning from token is fine.
        const dbUser = await checkExistingUser(user.email);

        if (!dbUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(dbUser);
    } catch (error) {
        console.error('Get ME error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
