import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

interface Note {
  id: number;
  text: string;
  archive: "Active" | "Archived";
  category: string;
  updatedAt: string;
}

interface Notes {
  notes: Note[];
  globalCategory: string;
  globalState: string;
  setGlobalCategory: (value: string) => void;
  setGlobalState: (value: string) => void;
  filterNotes: () => Note[];
  createNote: (category: string, text: string) => void;
  editNote: (id: number, newText: string) => void;
  deleteNote: (id: number) => void;
  archiveNote: (id: number) => void;
  changeCategory: (id: number, category: string) => void;
}

export const NotesStorage = createStore<Notes>()(
  persist(
    (set, get) => ({
      notes: [],
      globalCategory: " ",
      globalState: "Active",
      setGlobalCategory: (value: string) => set({ globalCategory: value }),
      setGlobalState: (value: string) => set({ globalState: value }),

      filterNotes: () => {
        let results = get().notes;
        const { globalCategory, globalState } = get();

        if (!results) return [];

        if (
          typeof globalCategory === "string" &&
          globalCategory.trim() !== ""
        ) {
          results = results.filter((note) => note.category === globalCategory);
        }

        if (typeof globalState === "string" && globalState.trim() !== "") {
          results = results.filter((note) => note.archive === globalState);
        }

        return results;
      },

      createNote: (category, text) => {
        const newNote: Note = {
          id: Date.now(),
          text,
          archive: "Active",
          category,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },

      editNote: (id, newText) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, text: newText, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      archiveNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  archive: note.archive === "Active" ? "Archived" : "Active",
                }
              : note
          ),
        }));
      },

      changeCategory: (id, category) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, category, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },
    }),
    { name: "notes-storage", skipHydration: true }
  )
);
