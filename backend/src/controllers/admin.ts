import { Response } from 'express';
import { CourseStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { getPendingCoursesDB, getPendingUsersDB, updateUserStatusDB } from '../models/user';
import { allCoursesDB, courseDeleteDB, courseStatusDB } from '../models/courses';
import { createNewRole } from '../models/admin';

export const reviewUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const action = req.params.action as string;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: 'Invalid action value' });
    }

    const updatedUser = await updateUserStatusDB({ id, action });

    return res.status(200).json({
      message: 'User status updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    console.log("Dashbord ", user?.id);

    if (!user) {
      res.status(404).json({ message: 'User not found in token' });
      return;
    }

    const [dbUsers, dbCourses] = await Promise.all([
      getPendingUsersDB(),
      getPendingCoursesDB()
    ]);

    res.status(200).json({ dbUsers, dbCourses });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const reviewCourseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const action = (req.params.action as string).toUpperCase();

    if (!["PUBLISHED", "ARCHIVED"].includes(action)) {
      return res.status(400).json({ message: 'Invalid action value' });
    }

    const updatedCourse = await courseStatusDB({
      id,
      change: action as CourseStatus
    });

    return res.status(200).json({
      message: 'Course status updated successfully',
      course: updatedCourse
    });

  } catch (error) {
    console.error('Course status update error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createCustomRole = async (req: AuthRequest, res: Response) => {
  try {
    const { name, permissions } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Invalid role name' });
    }

    const newRole = await createNewRole({ name, permissions });

    return res.status(201).json({
      message: 'Role created successfully',
      role: newRole
    });

  } catch (error) {
    console.error('Role creation error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await allCoursesDB();

    return res.status(200).json({ courses });

  } catch (error) {
    console.error('Get all courses error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid course id' });
    }

    await courseDeleteDB(id);

    return res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};