"use client";

import { TodoType } from "@/app/data/store";
import { forwardRef, useEffect, useRef } from "react";

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
    dragStart: (id: number) => void;
    dragEnd: () => void;
    item: TodoType;
    index: number;
    onToggle: () => void;
}
/*
    DOM 요소나 컴포넌트 인스턴스 참조
    forwardRef를 사용하면 부모 컴포넌트에서 자식 컴포넌트의 DOM 요소나 인스턴스에 접근할 수 있음
    
    ref를 컴포넌트 내부로 전달
    기본적으로 ref는 컴포넌트에서 직접 사용되지 않지만, forwardRef를 사용하면 외부에서 컴포넌트 내부의 DOM 요소에 ref를 전달할 수 있음.

    타입 순서 - forwardRef<ref 타입, props 타입>
    첫 번째 타입 파라미터는 ref 타입, 두 번째는 props 타입

    인자 순서 - ({props}, ref)
    첫 번째 인자는 props(구조분해할당), 두 번째 인자는 ref
    props는 컴포넌트의 데이터, ref는 DOM 참조로 구조적으로 다르게 처리됨

    props는 일반적인 컴포넌트 속성으로 먼저 처리되고, ref는 특수한 DOM 참조로 두 번째로 처리
    ref가 props 이후에 전달되는 이유는 props가 자식 요소 데이터이고, ref는 DOM 참조를 다루기 때문
*/
const TodoCard = forwardRef<HTMLDivElement, TodoCardProps>(({dragStart, dragEnd, item, index, onToggle}, ref) => {
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
            onDragStart={() => dragStart(item.id)}
            onDragEnd={() => dragEnd()}
            className={`flex gap-4 w-[calc(50%-0.5rem)] px-4 py-6 ${color} rounded-lg shadow-md cursor-pointer`}
            onClick={todoListCardClick} 
            draggable
        >
            <input ref={todoListCardRef} type="checkbox" onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }} />

            <div className="flex justify-between w-full items-center">
                <div>{item.content}</div>
                {item.completed && <div>✔</div>}
            </div>
        </div>
    );
});

TodoCard.displayName = "TodoCard";

export { TodoCard };