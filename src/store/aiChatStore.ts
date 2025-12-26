import { create } from "zustand";

interface nowChat {
    sessionId: string[],
    parentId: number,
    init: () => string,
    resetParentId: () => void,
    increaseParentId: () => void,
    setSessionId: (sessionId: string) => void,
    setParentId: (parentId: number) => void,
}

export const useAiChatStore = create<nowChat>((set) => ({
    sessionId: [''],
    parentId: 0,
    init: () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 20; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        set({ sessionId: [result], parentId: 0 });
        console.log(result, "这里");
        return result;
    },
    increaseParentId: () => set((state) => ({ parentId: state.parentId + 1 })),
    resetParentId: () => set({ parentId: 0 }),
    setSessionId: (i) => set({ sessionId: [i] }),
    setParentId: (i) => set({ parentId: i }),
}))