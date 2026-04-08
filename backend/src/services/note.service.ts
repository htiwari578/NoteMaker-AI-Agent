import { prisma } from "../lib/prisma.js";
import { normalize } from "../utils/normalize.js";
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
    async search(userId: string, query: string) {
    return prisma.note.findMany({
      where: {
        userId,
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        content: true,
        isCompleted: true,
      },
    });
  },
   async findByContent(userId: string, content: string) {
    const notes = await prisma.note.findMany({
      where: { userId },
    });

    const target = normalize(content);

    return notes.find((note) => normalize(note.content) === target);
  },
}