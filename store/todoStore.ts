import { create } from "zustand";

interface TodoStroe {
    refreshKey: number;
    triggerRefresh: () => void;
}
export const useTodoStore = create<TodoStroe>((set) => ({
    refreshKey: 0,
    triggerRefresh: () => set({refreshKey: Date.now()}) // 중복되지 않는 새로운 값을 추가하여 변화를 감지
}));