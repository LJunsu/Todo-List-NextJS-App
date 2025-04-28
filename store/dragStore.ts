import { create } from "zustand";

interface DragStore {
    isDragOn: boolean;
    setDragOn: () => void;
    setDragOff: () => void;
}
export const useDragStore = create<DragStore>((set) => ({
    isDragOn: false,
    setDragOn: () => set({ isDragOn: true }),
    setDragOff: () => set({ isDragOn: false }),
}));