"use client";

import { useEffect, useRef, useState } from "react";
import { TodoCard } from "./TodoCard";
import { todoDeleteAction } from "@/app/actions/todoDeleteAction";
import { TodoType } from "@/app/data/store";
import { todoCompletedAction } from "@/app/actions/todoCompletedAction";
import { getTodo } from "@/app/actions/getTodo";
import { useTodoStore } from "@/store/todoStore";
import { Pagination } from "./Pagination";

export function TodoList() {
    const limit = 4;
    const {refreshKey} = useTodoStore();

    const [list, setList] = useState<TodoType[]>([]);
    useEffect(() => {
        setCheckedList([]);
        setNowList(list.slice(0, limit));
    }, [list]);

    const [nowList, setNowList] = useState<TodoType[]>([]);
    
    const [page, setPage] = useState<number>(1);
    const handlePageChange = (page: number) => {
        setPage(page);

        let start = (page - 1) * limit;
        let end = page * limit;

        if (list.length > 0) {
            if (category == "all") {
                setNowList(list.slice(start, end));
            } else if (category == "Active") {
                setNowList(list.filter(item => !item.completed).slice(start, end));
            } else if (category == "completed") {
                setNowList(list.filter(item => item.completed).slice(start, end));
            }
        }
    };
    
    const [category, setCategory] = useState<string>("all");
    async function categoryChange() {
        setPage(1);
        getTodo(category).then((items) => {
            setList(items);
        });
    }
    useEffect(() => {
        categoryChange();
        setPage(1);
    }, [category, refreshKey]);

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

    const dragItem = useRef<HTMLDivElement[] | null[]>(new Array(list.length));
    const dragOverItem = useRef<HTMLLIElement[] | null[]>(new Array(3));
    const dragStart = (e: any, idx: number) => {
        console.log(idx);
        console.log(e.target);
    }
    console.log(dragItem);
    console.log(dragOverItem);

    return (
        <div className="flex flex-col gap-4 w-full">
            <ul className="flex justify-around pb-4 border-b-1 border-[#e2e2e2] *:cursor-pointer">
                <li 
                    ref={(el: HTMLLIElement) => {
                        dragOverItem.current[0] = el;
                    }}
                    className={`${category == "all" && "selected"}`}
                    onClick={() => setCategory("all")}
                >
                    ALL
                </li>

                <li 
                    ref={(el: HTMLLIElement) => {
                        dragOverItem.current[1] = el;
                    }}
                    className={`${category == "Active" && "selected"}`}
                    onClick={() => setCategory("Active")}
                >
                    Active
                </li>

                <li
                    ref={(el: HTMLLIElement) => {
                        dragOverItem.current[2] = el;
                    }}
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
                {nowList.length > 0 ? nowList.map((item, index) => <TodoCard key={index} ref={(el: HTMLDivElement) => {
                    dragItem.current[index] = el;
                }} dragStart={dragStart} item={item} index={index} onToggle={() => checkTodo(item.id)} />) : <div>There is no todo.</div>}
            </div>

            <Pagination
                totalPage={Math.ceil(list.length / limit)}
                limit={limit}
                page={page}
                setPage={handlePageChange}
            />
        </div>
    );
}