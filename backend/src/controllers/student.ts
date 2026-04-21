import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getPublishedCoursesDB,
  getCourseDetailsDB,
  enrollCourseDB,
  getMyEnrollmentsDB,
  getMyProgressDB,
  getEnrollmentProgressDB,
  updateLessonProgressDB,
  getLastViewedLessonDB,
  startQuizAttemptDB,
  submitQuizAttemptDB,
  getMyQuizAttemptsDB,
  getMyCertificatesDB
} from '../models/students';

export const getPublishedCourses = async (req: AuthRequest, res: Response) => {
  const courses = await getPublishedCoursesDB();
  res.json({ courses });
};

export const getCourseDetails = async (req: AuthRequest, res: Response) => {
  const course = await getCourseDetailsDB(Number(req.params.id));
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ course });
};

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const enrollment = await enrollCourseDB(req.user!.id, Number(req.params.courseId));
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  const enrollments = await getMyEnrollmentsDB(req.user!.id);
  res.json({ enrollments });
};

export const getMyProgress = async (req: AuthRequest, res: Response) => {
  const progress = await getMyProgressDB(req.user!.id);
  const data = progress.map(p => ({
    courseId: p.course.id,
    title: p.course.title,
    totalLessons: p.course._count.lessons,
    completedLessons: p.progress.length,
    percent: p.course._count.lessons ? Math.round((p.progress.length / p.course._count.lessons) * 100) : 0
  }));
  res.json({ progress: data });
};

export const getEnrollmentProgress = async (req: AuthRequest, res: Response) => {
  const enrollment = await getEnrollmentProgressDB(req.user!.id, Number(req.params.courseId));
  if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });
  res.json({ enrollment });
};

export const updateLessonProgress = async (req: AuthRequest, res: Response) => {
  const { enrollmentId, lessonId, isComplete } = req.body;
  const progress = await updateLessonProgressDB(req.user!.id, enrollmentId, lessonId, !!isComplete);
  res.json({ progress });
};

export const getLastViewed = async (req: AuthRequest, res: Response) => {
  const last = await getLastViewedLessonDB(req.user!.id);
  res.json({ lastViewed: last });
};

export const startQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const attempt = await startQuizAttemptDB(req.user!.id, Number(req.params.quizId));
    res.status(201).json({ attempt });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body;
    const result = await submitQuizAttemptDB(Number(req.params.attemptId), answers);
    res.json({ message: result.passed ? 'Passed' : 'Failed', result });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const getMyAttempts = async (req: AuthRequest, res: Response) => {
  const attempts = await getMyQuizAttemptsDB(req.user!.id);
  res.json({ attempts });
};

export const getMyCertificates = async (req: AuthRequest, res: Response) => {
  const certificates = await getMyCertificatesDB(req.user!.id);
  res.json({ certificates });
};