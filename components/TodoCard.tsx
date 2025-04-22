"use client";

import { useRef } from "react";

const getColor = (color: number) => {
    color = color % 3;

    switch(color) {
        case 0:
            return "bg-amber-200";
        case 1:
            return "bg-rose-200";
        case 2:
            return "bg-sky-200";
        default:
            return "bg-gray-200";
    }
};

type TodoCardProps = {
    item: string;
    index: number;
    onToggle: () => void;
}
export function TodoCard({item, index, onToggle}: TodoCardProps) {
    const todoListCardRef = useRef<HTMLInputElement>(null);
    const todoListCardClick = () => {
        onToggle();
        
        if (todoListCardRef.current) {
            todoListCardRef.current.checked = !todoListCardRef.current.checked;
        }
    };

    const color = getColor(index);

    return (
        <div onClick={todoListCardClick} className={`flex gap-4 w-[calc(50%-0.5rem)] px-4 py-6 ${color} rounded-lg shadow-md duration-200`}>
            <input ref={todoListCardRef} type="checkbox" />

            <div>
                {item}
            </div>
        </div>
    );
}