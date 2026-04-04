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
}