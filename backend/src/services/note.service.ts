import { prisma } from "../lib/prisma.js";
export const noteService = {
  async getAll(userId: string) {
    return prisma.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
   async create(userId: string, content: string) {
    return prisma.note.create({
      data: {
        content,
        userId,
      },
    });
  },
}