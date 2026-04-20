import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";

import express, { Request, Response } from 'express';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());


app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
