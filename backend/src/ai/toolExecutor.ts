import { noteService } from "../services/note.service.js";
import { ToolExecutor } from "../types/index.js";



async function resolveNoteId(userId: string, args: any) {
    if(args.noteId) return args.noteId;

    if(!args.query) return null;

    //search notes with query, return top result's ID as default

    const results = await noteService.search(userId, args.query);
    if(results.length === 0) return null;

    return results[0].id;

}

export const toolRegistery: Record<string, ToolExecutor> = {
    create_note: async (userId, args) => {
        return noteService.create(userId, args.content);
    },


search_notes: async (userId, args)=> {
    return noteService.search(userId, args.query);
    },

search_completed_notes: async (userId) => {
    return noteService.searchCompletedNotes(userId);
},

search_incompleted_notes: async (userId) => {
    return noteService.searchIncompletedNotes(userId);
},

update_one: async (userId, args) => {
    const noteId = await resolveNoteId(userId, args);
    if(!noteId) {
        throw new Error("Note not found for update");
    }
    return noteService.update(noteId, userId, args.content);
},

complete_note: async (userId, args) => {
    const noteId = await resolveNoteId(userId, args);
    if(!noteId) {
        throw new Error("Note not found for completion");
    }
    return noteService.complete(noteId, userId);
},

delete_note: async (userId, args) => {
    const noteId = await resolveNoteId(userId, args);
    if(!noteId) {
        throw new Error("Note not found for deletion");
    }
    return noteService.delete(noteId, userId);
},

};