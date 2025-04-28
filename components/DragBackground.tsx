"use client";

import { useDragStore } from "@/store/dragStore"

export function DragBackground() {
    const {isDragOn} = useDragStore();

    return (
        <div className={`${!isDragOn && "hidden"} absolute top-0 left-0 w-full h-full z-30 bg-black opacity-30`} />
    )
}