import prisma from '../db';
import { CourseStatus, EnrollmentStatus } from '@prisma/client';

export async function getPublishedCoursesDB() {
  return prisma.course.findMany({
    where: { status: CourseStatus.PUBLISHED },
    include: {
      instructor: { select: { id: true, name: true } },
      _count: { select: { lessons: true, enrollments: true, quizzes: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getCourseDetailsDB(courseId: number) {
  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: { select: { id: true, name: true, email: true } },
      lessons: { orderBy: { sequence: 'asc' } },
      quizzes: { select: { id: true, title: true, timeLimit: true, passMarks: true } }
    }
  });
}

export async function enrollCourseDB(userId: number, courseId: number) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, status: CourseStatus.PUBLISHED }
  });
  if (!course) throw new Error('Course not available');

  return prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
    include: { course: true }
  });
}

export async function getMyEnrollmentsDB(userId: number) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          _count: { select: { lessons: true } }
        }
      },
      progress: { where: { isComplete: true } },
      certificate: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getMyProgressDB(userId: number) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: { select: { id: true, title: true, _count: { select: { lessons: true } } } },
      progress: { where: { isComplete: true } }
    }
  });
}

export async function getEnrollmentProgressDB(userId: number, courseId: number) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      course: { include: { lessons: { orderBy: { sequence: 'asc' } } } },
      progress: true
    }
  });
}

export async function updateLessonProgressDB(userId: number, enrollmentId: number, lessonId: number, isComplete: boolean) {
  return prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
    update: { isComplete, completedAt: isComplete ? new Date() : null, userId },
    create: { enrollmentId, lessonId, userId, isComplete, completedAt: isComplete ? new Date() : null }
  });
}

export async function getLastViewedLessonDB(userId: number) {
  return prisma.lessonProgress.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { lesson: { include: { course: { select: { id: true, title: true, thumbnail: true } } } } }
  });
}

export async function startQuizAttemptDB(studentId: number, quizId: number) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) throw new Error('Quiz not found');

  const count = await prisma.quizAttempt.count({ where: { studentId, quizId } });
  if (count >= quiz.maxAttempts) throw new Error('Max attempts reached');

  return prisma.quizAttempt.create({
    data: { studentId, quizId },
    include: { quiz: { select: { title: true, timeLimit: true, passMarks: true } } }
  });
}

export async function submitQuizAttemptDB(attemptId: number, answers: { questionId: number; optionId: number }[]) {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: { quiz: { include: { questions: { include: { options: true } } } } }
  });
  if (!attempt || attempt.submittedAt) throw new Error('Invalid attempt');

  let correct = 0;
  const data = answers.map(a => {
    const opt = attempt.quiz.questions.find(q => q.id === a.questionId)?.options.find(o => o.id === a.optionId);
    const isCorrect = !!opt?.isCorrect;
    if (isCorrect) correct++;
    return { attemptId, questionId: a.questionId, optionId: a.optionId, isCorrect };
  });

  await prisma.attemptAnswer.createMany({ data, skipDuplicates: true });

  const total = attempt.quiz.questions.length;
  const score = total ? (correct / total) * 100 : 0;
  const passed = score >= attempt.quiz.passMarks;

  const updated = await prisma.quizAttempt.update({
    where: { id: attemptId },
    data: { score, passed, submittedAt: new Date() }
  });

  if (passed) {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: attempt.studentId, courseId: attempt.quiz.courseId },
      include: { course: { include: { _count: { select: { lessons: true } } } }, progress: { where: { isComplete: true } } }
    });
    if (enrollment && enrollment.progress.length >= enrollment.course._count.lessons) {
      await prisma.certificate.upsert({
        where: { enrollmentId: enrollment.id },
        update: {},
        create: { studentId: attempt.studentId, courseId: attempt.quiz.courseId, enrollmentId: enrollment.id, attemptId }
      });
      await prisma.enrollment.update({ where: { id: enrollment.id }, data: { status: EnrollmentStatus.COMPLETED, completedAt: new Date() } });
    }
  }

  return updated;
}

export async function getMyQuizAttemptsDB(userId: number) {
  return prisma.quizAttempt.findMany({
    where: { studentId: userId },
    include: { quiz: { include: { course: { select: { id: true, title: true } } } } },
    orderBy: { startedAt: 'desc' }
  });
}

export async function getMyCertificatesDB(userId: number) {
  return prisma.certificate.findMany({
    where: { studentId: userId },
    include: { course: { select: { id: true, title: true, thumbnail: true } } },
    orderBy: { issuedAt: 'desc' }
  });
}