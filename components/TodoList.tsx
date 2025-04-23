"use client";

import { useEffect, useState } from "react";
import { TodoCard } from "./TodoCard";
import { todoDeleteAction } from "@/app/actions/todoDeleteAction";
import { TodoType } from "@/app/data/store";
import { todoCompletedAction } from "@/app/actions/todoCompletedAction";
import { getTodo } from "@/app/actions/getTodo";
import { useTodoStore } from "@/store/todoStore";

export function TodoList() {
    const {refreshKey} = useTodoStore();
    const [list, setList] = useState<TodoType[]>([]);
    const [category, setCategory] = useState<string>("all");

    async function categoryChange() {
        getTodo(category).then((items) => {
            setList(items);
        });
    }
    useEffect(() => {
        categoryChange();
    }, [category, refreshKey]);
    useEffect(() => {
        setCheckedList([]);
    }, [list]);

    const [checkedList, setCheckedList] = useState<number[]>([]);
    const checkTodo = (id: number) => {
        setCheckedList((prev) => {
            const newList = [...prev];
            if(!newList.includes(id)) newList.push(id);
            else {
                const deleteIndex = newList.findIndex(itemId => itemId == id);
                newList.splice(deleteIndex, 1);
            }
            return newList;
        });
    };

    const completedTodo = async () => {
        await todoCompletedAction(checkedList);
        categoryChange();
    }

    const deleteTodo = async () => {
        await todoDeleteAction(checkedList);
        categoryChange();
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <ul className="flex justify-around pb-4 border-b-1 border-[#e2e2e2] *:cursor-pointer">
                <li 
                    className={`${category == "all" && "selected"}`}
                    onClick={() => setCategory("all")}
                >
                    ALL
                </li>

                <li 
                    className={`${category == "Active" && "selected"}`}
                    onClick={() => setCategory("Active")}
                >
                    Active
                </li>

                <li
                    className={`${category == "completed" && "selected"}`}
                    onClick={() => setCategory("completed")}
                >
                    Completed
                </li>
            </ul>

            <div className="flex gap-4 w-full pt-4">
                <button onClick={completedTodo} className="w-1/2 h-12 bg-[#4E89FF] text-white rounded-lg cursor-pointer duration-200 hover:bg-[#366EDD]">Complete</button>
                <button onClick={deleteTodo} className="w-1/2 h-12 bg-[#ff4e4e] text-white rounded-lg cursor-pointer duration-200 hover:bg-[#dd3636]">Delete</button>
            </div>

            <div className="flex flex-wrap gap-4 w-full">
                {list.length > 0 ? list.map((item, index) => <TodoCard key={index} item={item} index={index} onToggle={() => checkTodo(item.id)} />) : <div>There is no todo.</div>}
            </div>
        </div>
    );
}