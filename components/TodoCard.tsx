"use client";

import { TodoType } from "@/app/data/store";
import { useEffect, useRef } from "react";

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
    ref: HTMLDivElement;
    dragStart: (e:DragEvent, id: number) => void;
    dragEnd: (e: DragEvent) => void;
    item: TodoType;
    index: number;
    onToggle: () => void;
}
export function TodoCard({ref, dragStart, dragEnd, item, index, onToggle}: TodoCardProps) {
    const color = getColor(index);

    const todoListCardRef = useRef<HTMLInputElement>(null);
    const todoListCardClick = () => {
        onToggle();

        if (todoListCardRef.current) {
            todoListCardRef.current.checked = !todoListCardRef.current.checked;
        }
    };

    useEffect(() => {
        if (todoListCardRef.current) {
            todoListCardRef.current.checked = false;
        }
    }, [item]);

    return (
        <div 
            ref={ref}
            data-id={item.id}
            onDragStart={(e: React.DragEvent<HTMLDivElement>) => dragStart(e, item.id)}
            onDragEnd={(e: React.DragEvent<HTMLDivElement>) => dragEnd(e)}
            className={`flex gap-4 w-[calc(50%-0.5rem)] px-4 py-6 ${color} rounded-lg shadow-md cursor-pointer`}
            onClick={todoListCardClick} 
            draggable
        >
            <input ref={todoListCardRef} type="checkbox" onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }} />

            <div className="flex justify-between w-full">
                <div>{item.content}</div>
                {item.completed && <div>✔</div>}
            </div>
        </div>
    );
}