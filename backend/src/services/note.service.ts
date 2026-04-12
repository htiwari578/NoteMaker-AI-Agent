import { prisma } from "../lib/prisma.js";
import { normalize } from "../utils/normalize.js";
export const noteService = {

  //fetch all notes
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
  //insert new note
   async create(userId: string, content: string) {
    return prisma.note.create({
      data: {
        content,
        userId,
      },
    });
  },
  //full-text search by content
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
  // exact match after normalizing
   async findByContent(userId: string, content: string) {
    const notes = await prisma.note.findMany({
      where: { userId },
    });

    const target = normalize(content);

    return notes.find((note) => normalize(note.content) === target);
  },
  //filter inCompleted: true
  async searchCompletedNotes(userId: string) {
    return prisma.note.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      select: {
        id: true,
        content: true,
        isCompleted: true,      
      },
    });
  },
  // filter isCompleted: false
  async searchIncompletedNotes(userId: string) {
    return prisma.note.findMany({
      where: {
        userId,
        isCompleted: false,
      },
      select: {
        id: true,
        content: true,
        isCompleted: true,
      },
    });
  },

  //edit note content

  async update (noteId: string, userId: string, content: string) {
    return prisma.note.updateMany({
      where: {
        id: noteId,
        userId,
      },
      data: {
        content,
      },
    });
  },
  //mark note completed
  async complete(noteId: string, userId: string) {
    return prisma.note.updateMany({
      where: {
        id: noteId,
        userId,
      },
      data: {
        isCompleted: true,
      },
    });
  },
  //delete note
  async delete(noteId: string, userId: string) {
    return prisma.note.deleteMany({
      where: {
        id: noteId,
        userId,
      },
    });
  },
}