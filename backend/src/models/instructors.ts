import prisma from '../db';

export async function addQuizDB({ courseId, title, timeLimit, passMarks, maxAttempts }: any) {
  const quiz = await prisma.quiz.create({
    data: {
      courseId:    Number(courseId),
      title,
      timeLimit:   Number(timeLimit),
      passMarks:   Number(passMarks),
      maxAttempts: Number(maxAttempts) || 3,
    },
    include: {
      questions: true
    }
  });
  return quiz;
}

export async function addQuestionDB({ quizId, text, orderIndex, options }: any) {
  const question = await prisma.question.create({
    data: {
      quizId:     Number(quizId),
      text,
      orderIndex: Number(orderIndex),
      options: {
        create: options.map((opt: any) => ({
          text:      opt.text,
          isCorrect: opt.isCorrect
        }))
      }
    },
    include: {
      options: true
    }
  });
  return question;
}

export async function getQuizByCourseDB(courseId: any) {
  const quizzes = await prisma.quiz.findMany({
    where: {
      courseId: Number(courseId)
    },
    include: {
      questions: {
        include: {
          options: true
        },
        orderBy: {
          orderIndex: 'asc'
        }
      },
      _count: {
        select: {
          attempts: true,
          questions: true
        }
      }
    }
  });
  return quizzes;
}

export async function deleteQuizDB(quizId: any) {
  await prisma.quiz.delete({
    where: {
      id: Number(quizId)
    }
  });
  return;
}

export async function getEnrolledStudentsDB(courseId: any, instructorId: any) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      courseId: Number(courseId),
      course: {
        instructorId: Number(instructorId)
      }
    },
    include: {
      user: {
        select: {
          id:    true,
          name:  true,
          email: true,
          role:  true,
        }
      },
      progress: {
        select: {
          lessonId:    true,
          isComplete:  true,
          completedAt: true,
        }
      },
      _count: {
        select: {
          progress: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return enrollments;
}

export async function getStudentPerformanceDB(courseId: any, studentId: any, instructorId: any) {
  const course = await prisma.course.findFirst({
    where: {
      id:           Number(courseId),
      instructorId: Number(instructorId)
    },
    include: {
      lessons: {
        select: {
          id:       true,
          title:    true,
          sequence: true,
        },
        orderBy: {
          sequence: 'asc'
        }
      },
      quizzes: {
        select: {
          id:    true,
          title: true,
        }
      }
    }
  });

  if (!course) return null;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId:   Number(studentId),
        courseId: Number(courseId)
      }
    },
    include: {
      progress: {
        include: {
          lesson: {
            select: {
              id:       true,
              title:    true,
              sequence: true,
            }
          }
        }
      },
      certificate: true
    }
  });

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      studentId: Number(studentId),
      quiz: {
        courseId: Number(courseId)
      }
    },
    include: {
      quiz: {
        select: {
          id:        true,
          title:     true,
          passMarks: true,
        }
      },
      answers: {
        include: {
          question: {
            select: {
              id:   true,
              text: true,
            }
          },
          option: {
            select: {
              id:        true,
              text:      true,
              isCorrect: true,
            }
          }
        }
      }
    },
    orderBy: {
      startedAt: 'desc'
    }
  });

  const totalLessons    = course.lessons.length;
  const completedLessons = enrollment?.progress.filter(p => p.isComplete).length || 0;
  const progressPercent  = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return {
    student: {
      id:       Number(studentId),
      courseId: Number(courseId),
    },
    enrollment: {
      status:      enrollment?.status,
      completedAt: enrollment?.completedAt,
      certificate: enrollment?.certificate,
    },
    lessonProgress: {
      total:     totalLessons,
      completed: completedLessons,
      percent:   progressPercent,
      details:   enrollment?.progress || []
    },
    quizAttempts: attempts
  };
}

export async function deleteOwnCourseDB(courseId: any, instructorId: any) {
  const course = await prisma.course.findFirst({
    where: {
      id:           Number(courseId),
      instructorId: Number(instructorId)
    }
  });

  if (!course) return null;

  await prisma.course.delete({
    where: {
      id: Number(courseId)
    }
  });

  return course;
}

export async function getAllEnrolledStudentsAllCoursesDB(instructorId: any) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: {
        instructorId: Number(instructorId)
      }
    },
    include: {
      user: {
        select: {
          id:    true,
          name:  true,
          email: true,
        }
      },
      course: {
        select: {
          id:    true,
          title: true,
        }
      },
      _count: {
        select: {
          progress: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return enrollments;
}