import { Request, Response } from 'express';
import { Status, CourseStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import {
  addCoursesDB,
  addLessonDB,
  courseStatusDB,
  editCourseDB,
  findInstructorsCoursesDB,
  findValidCourseDB,
} from '../models/courses';

import {
  addQuizDB,
  addQuestionDB,
  getQuizByCourseDB,
  deleteQuizDB,
  getEnrolledStudentsDB,
  getStudentPerformanceDB,
  deleteOwnCourseDB,
  getAllEnrolledStudentsAllCoursesDB
} from '../models/instructors';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(404).json({ message: 'User not found in token' });
      return;
    }

    if (user.status !== Status.ACTIVE) {
      res.status(403).json({ message: 'Account needs to be approved' });
      return;
    }

    const courses = await findInstructorsCoursesDB(user);

    res.status(200).json({ courses });

  } catch (error) {
    console.error('Cannot fetch courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const courseData = req.body;

    if (!user) {
      res.status(404).json({ message: 'User not found in token' });
      return;
    }

    if (user.status !== Status.ACTIVE) {
      res.status(403).json({ message: 'Account needs to be approved' });
      return;
    }

    const course = await addCoursesDB(user, courseData);

    res.status(201).json({
      message: 'Course added successfully',
      course
    });

  } catch (error) {
    console.error('Error while adding course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const courseReviewSubmit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    const course = await findValidCourseDB(id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.status === CourseStatus.PUBLISHED) {
      res.status(400).json({ message: 'Course is already published' });
      return;
    }

    const updatedCourse = await courseStatusDB({ id, change: CourseStatus.PENDING });

    res.status(200).json({
      message: 'Course submitted for admin review',
      course: updatedCourse
    });

  } catch (error) {
    console.error('Error while submitting course for review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, ...lessonData } = req.body;

    const course = await findValidCourseDB(id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const newLesson = await addLessonDB(id, lessonData);

    res.status(201).json({
      message: 'Lesson added successfully',
      lesson: newLesson
    });

  } catch (error) {
    console.error('Error while adding lesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const editCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updateInfo = req.body;
    const { id } = req.params;

    const course = await findValidCourseDB(id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const updatedCourse = await editCourseDB({ updateInfo, id });

    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse
    });

  } catch (error) {
    console.error('Error while editing course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { courseId, title, timeLimit, passMarks, maxAttempts } = req.body;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const course = await findValidCourseDB(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.instructorId !== user.id) {
      res.status(403).json({ message: 'You do not own this course' });
      return;
    }

    const quiz = await addQuizDB({ courseId, title, timeLimit, passMarks, maxAttempts });

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });

  } catch (error) {
    console.error('Add quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { quizId, text, orderIndex, options } = req.body;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      res.status(400).json({ message: 'At least 2 options required' });
      return;
    }

    const hasCorrectAnswer = options.some((opt: any) => opt.isCorrect === true);
    if (!hasCorrectAnswer) {
      res.status(400).json({ message: 'At least one option must be correct' });
      return;
    }

    const question = await addQuestionDB({ quizId, text, orderIndex, options });

    res.status(201).json({
      message: 'Question added successfully',
      question
    });

  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizzesByCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const courseId = req.params.courseId as string;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const course = await findValidCourseDB(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.instructorId !== user.id) {
      res.status(403).json({ message: 'You do not own this course' });
      return;
    }

    const quizzes = await getQuizByCourseDB(courseId);

    res.status(200).json({ quizzes });

  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const quizId = req.params.quizId as string;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await deleteQuizDB(quizId);

    res.status(200).json({ message: 'Quiz deleted successfully' });

  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteOwnCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const courseId = req.params.courseId as string;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const deleted = await deleteOwnCourseDB(courseId, user.id);

    if (!deleted) {
      res.status(403).json({ message: 'Course not found or you do not own this course' });
      return;
    }

    res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEnrolledStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const courseId = req.params.courseId as string;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const course = await findValidCourseDB(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.instructorId !== user.id) {
      res.status(403).json({ message: 'You do not own this course' });
      return;
    }

    const students = await getEnrolledStudentsDB(courseId, user.id);

    res.status(200).json({
      total: students.length,
      students
    });

  } catch (error) {
    console.error('Get enrolled students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentPerformance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user      = req.user;
    const courseId  = req.params.courseId  as string;
    const studentId = req.params.studentId as string;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const performance = await getStudentPerformanceDB(courseId, studentId, user.id);

    if (!performance) {
      res.status(403).json({ message: 'Course not found or you do not own this course' });
      return;
    }

    res.status(200).json({ performance });

  } catch (error) {
    console.error('Get student performance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllStudentsAllCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const enrollments = await getAllEnrolledStudentsAllCoursesDB(user.id);

    res.status(200).json({
      total: enrollments.length,
      enrollments
    });

  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};