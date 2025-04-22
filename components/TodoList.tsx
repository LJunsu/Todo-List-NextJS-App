"use client";

import { useState } from "react";
import { TodoCard } from "./TodoCard";
import { todoDeleteAction } from "@/app/actions/todoDeleteAction";
import { TodoType } from "@/app/data/store";

export function TodoList({list}: {list: TodoType[]}) {
    const [checkedList, setCheckedList] = useState<boolean[]>(Array(list.length).fill(false));
    const checkTodo = (index: number) => {
        setCheckedList((prev) => {
            const newList = [...prev];
            newList[index] = !newList[index];
            return newList;
        });
    };

    const completedTodo = () => {
        const completedList = checkedList.map(
            (checked, index) => (checked ? index : null)
        ).filter((v) => v !== null);

        console.log(completedList);
    }

    const deleteTodo = async () => {
        const deleteList = checkedList.map(
            (checked, index) => (checked ? index : null)
        ).filter((v) => v !== null);

        await todoDeleteAction(deleteList);
        setCheckedList(Array(list.length).fill(false));
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4 w-full pb-4 border-b-1 border-[#e2e2e2]">
                <button onClick={completedTodo} className="w-1/2 h-12 bg-[#4E89FF] text-white rounded-lg cursor-pointer duration-200 hover:bg-[#366EDD]">Completed</button>
                <button onClick={deleteTodo} className="w-1/2 h-12 bg-[#ff4e4e] text-white rounded-lg cursor-pointer duration-200 hover:bg-[#dd3636]">Delete</button>
            </div>

            <div className="flex flex-wrap gap-4 w-full">
                {list && list.map((item, index) => <TodoCard key={index} item={item} index={index} onToggle={() => checkTodo(index)} />)}
            </div>
        </div>
    );
}