import prisma from '../db';
import { CourseStatus, Difficulty, Pricing } from '@prisma/client';

export async function addCoursesDB(user: any, courseData: any) {
  const course = await prisma.course.create({
    data: {
      title:        courseData.title,
      description:  courseData.description,
      category:     courseData.category,
      difficulty:   courseData.difficulty as Difficulty,
      pricing:      courseData.pricing    as Pricing,
      price:        courseData.price ? Number(courseData.price) : null,
      status:       CourseStatus.DRAFT,
      thumbnail:    courseData.thumbnail,
      instructorId: user.id,
    },
  });
  return course;
}

export async function findInstructorsCoursesDB(user: any) {
  const courses = await prisma.course.findMany({
    where: {
      instructorId: user.id,
    },
    include: {
      lessons: {
        select: {
          id: true,
          title: true,
          sequence: true,
          isFree: true,
        },
        orderBy: {
          sequence: 'asc',
        },
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return courses;
}

export async function findValidCourseDB(id: any) {
  const course = await prisma.course.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      lessons: {
        orderBy: {
          sequence: 'asc',
        },
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
  });
  return course;
}

export async function courseStatusDB({ id, change }: any) {
  const course = await prisma.course.update({
    where: {
      id: Number(id),
    },
    data: {
      status: change as CourseStatus,
    },
  });
  return course;
}

export async function allCoursesDB() {
  const allAvailableCourses = await prisma.course.findMany({
    where: {
      status: {
        in: [CourseStatus.PENDING, CourseStatus.PUBLISHED],
      },
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return allAvailableCourses;
}

export async function courseDeleteDB(id: number) {
  await prisma.course.delete({
    where: {
      id: Number(id),
    },
  });
  return;
}

export async function addLessonDB(id: number, lessonData: any) {
  const addNewLesson = await prisma.lesson.create({
    data: {
      courseId: Number(id),
      title:    lessonData.title,
      content:  lessonData.content,
      videoUrl: lessonData.videoUrl,
      sequence: Number(lessonData.sequence),
      isFree:   lessonData.isFree,
    },
  });
  return addNewLesson;
}

export async function editCourseDB({ updateInfo, id }: any) {
  const updateCourse = await prisma.course.update({
    where: {
      id: Number(id),
    },
    data: {
      title:       updateInfo.title,
      description: updateInfo.description,
      category:    updateInfo.category,
      difficulty:  updateInfo.difficulty as Difficulty,
      pricing:     updateInfo.pricing    as Pricing,
      price:       updateInfo.pricing === Pricing.FREE ? null : Number(updateInfo.price),
      thumbnail:   updateInfo.thumbnail,
    },
  });
  return updateCourse;
}