import prisma from '../db';



export const getRole = async (id:any) => {
    try {

        if (!id) {
            return false;
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return false;
        }
        return user.role;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
};
