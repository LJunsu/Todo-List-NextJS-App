"use client";

import { useState } from "react";
import { TodoCard } from "./TodoCard";

type TodoListProps = {
    list: string[];
}
export function TodoList({list}: TodoListProps) {
    const [checkedList, setCheckedList] = useState<boolean[]>(Array(list.length).fill(false));
    const checkTodo = (index: number) => {
        setCheckedList((prev) => {
            const newList = [...prev];
            newList[index] = !newList[index];
            return newList;
        });
    };

    const deleteTodo = () => {
        const deleteList = checkedList.map(
            (checked, index) => (checked ? index : null)
        ).filter((v) => v !== null);

        console.log(deleteList);
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <button onClick={deleteTodo} className="h-12 bg-[#ff4e4e] text-white rounded-lg cursor-pointer duration-200 hover:bg-[#dd3636]">Delete</button>

            <div className="flex flex-wrap gap-4 w-full">
                {list.map((item, index) => <TodoCard key={index} item={item} index={index} onToggle={() => checkTodo(index)} />)}
            </div>
        </div>
    );
}