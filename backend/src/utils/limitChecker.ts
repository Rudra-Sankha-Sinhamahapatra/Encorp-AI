import prisma from "../db/db";
import { startOfDay, endOfDay } from "date-fns";

export async function checkLimit(userId:number) {
    try {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const count = await prisma.presentationCount.count({
            where: {
                userId: userId,
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        })

        return count < 1;
    } catch (error) {
        console.error(error);
    }
}

export async function recordPresentationGeneration(userId:number) {
    try {
        await prisma.presentationCount.create({
            data: {
                userId: userId
            }
        })
    } catch (error) {
        console.error(error);
    }
}