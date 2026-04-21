import prisma from '../db';


// for /addcourse 
export async function addCoursesDB(user: any) {
    const course = await prisma.courses.create({
        data: {
            title: "Test2",
            description: "Test desc2",
            category: "Programming2",
            difficulty: "Beginner2",
            pricing: "free",
            price: 0,
            status: "draft",
            thumbnail: "url",
            userId: user.id,
        },
    });
    return course;
}



// for /dashboard
export async function findInstructorsCoursesDB(user: any) {
    const courses = await prisma.courses.findMany({
        where: { userId: user.id }
    })

    return courses;
}

export async function findValidCourseDB(id: any) {
    const course = await prisma.courses.findUnique({
        where: {
            id: Number(id)
        }
    })
    return course;
}

export async function couseStatusDB({ id, change }: any) {
    console.log("Update to " + change);
    const course = await prisma.courses.update({
        where: {
            id: Number(id)
        },
        data: {
            status: change
        }

    })
    return course;
}

export async function allCoursesDB() {
    const allAvailableCourses = await prisma.courses.findMany({
        where: {
            status: {
                in: ['pending', 'publish']
            }
        }
    })
    return allAvailableCourses;
}


export async function courseDeleteDB(id:number) {
    await prisma.courses.delete({
        where: {
            id
        }
    })
    return;
}