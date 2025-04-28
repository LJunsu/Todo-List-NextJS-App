"use client";

import { useEffect, useRef, useState } from "react";
import { TodoCard } from "./TodoCard";
import { todoDeleteAction } from "@/app/actions/todoDeleteAction";
import { TodoType } from "@/app/data/store";
import { todoCompletedAction } from "@/app/actions/todoCompletedAction";
import { getTodo } from "@/app/actions/getTodo";
import { useTodoStore } from "@/store/todoStore";
import { Pagination } from "./Pagination";
import { todoToActiveAction } from "@/app/actions/todoToActiveAction";
import { todoToCompletedAction } from "@/app/actions/todoToCompletedAction";

export function TodoList() {
    const limit = 4; // 페이지네이션에서 한 페이지에 표시할 데이터의 갯수와 페이지네이션의 PageArray 크기
    const {refreshKey} = useTodoStore(); // TodoInputForm에서 todo를 추가 시 TodoList에 todoList의 변화를 알리기 위함

    const [list, setList] = useState<TodoType[]>([]); // 저장된 todoList의 전체 데이터 배열
    useEffect(() => {
        setCheckedList([]); // todoList가 변화했음으로, 사용자가 선택한 todoList를 초기화
        setNowList(list.slice(0, limit)); // 전체 todoList 배열에서 limit 만큼의 todoList를 잘라내 저장
    }, [list]);

    const [nowList, setNowList] = useState<TodoType[]>([]); // 페이지네이션로 현재 페이지의 todoList 데이터
    
    const [page, setPage] = useState<number>(1);
    const handlePageChange = (page: number) => {
        setPage(page);

        let start = (page - 1) * limit;
        let end = page * limit;

        // 각 카테고리의 todoList 중 현재 페이지에 해당하는 todoList 데이터를 저장
        if (list.length > 0) {
            if (category == "all") {
                setNowList(list.slice(start, end));
            } else if (category == "Active") {
                // 전체 todoList 중 completed 속성이 flase인 todo만 필터링 후 페이지에 해당하는 데이터 저장
                setNowList(list.filter(item => !item.completed).slice(start, end)); 
            } else if (category == "completed") {
                // 전체 todoList 중 completed 속성이 true인 todo만 필터링 후 페이지에 해당하는 데이터 저장
                setNowList(list.filter(item => item.completed).slice(start, end));
            }
        }
    };
    
    const [category, setCategory] = useState<string>("all");
    // 카테고리 변경 시 페이지를 초기화하고 해당 카테고리의 todoList를 불러온 후 list state에 저장
    // *추가로 todoList의 변화가 생겼을 때에도 함수를 호출하여 최신의 todoList를 불러옴
    async function categoryChange() {
        setPage(1);
        getTodo(category).then((items) => {
            setList(items);
        });
    }
    // 카테고리의 변화와 todo가 추가되어 최신의 todoList가 필요할 때 호출되는 useEffect
    useEffect(() => {
        categoryChange();
        setPage(1);
    }, [category, refreshKey]); 

    // 사용자가 선택한 todo의 id를 저장하는 배열
    const [checkedList, setCheckedList] = useState<number[]>([]);
    // 사용자가 todo를 선택하거나 해제할 때 호출되는 함수
    const checkTodo = (id: number) => {
        setCheckedList((prev) => { 
            const newList = [...prev]; // prev - 기존 checkedList 배열
            // 사용자가 선택한 todo가 배열에 없다면, todo의 id를 추가
            if(!newList.includes(id)) newList.push(id); 
            // 사용자가 선택한 todo가 배열에 있다면(이미 선택한 todo라면), 
            // 배열에 해당 todo의 id를 찾아 제거
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

    let selectedItem = -1;
    let selectedCategory = -1;
    
    // todo(div 태그)가 드래그를 시작할 때 호출되는 함수
    const dragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        selectedItem = idx; // selectedItem에 현재 드래그 중인 todo의 id를 저장
    }
    /*
        기존 dragEnter(TodoCard 컴포넌트)로 진행 시, 
        Drop보다 Leave가 먼저 수행되는 타이밍 이슈로 인해 
        dragOver(카테고리 li태그)로 변경하여 해결
    */
    // todo(div 태그)가 카테고리(li 태그) 위로 드래그될 때 호출되는 함수
    const dragOver = (e: React.DragEvent<HTMLLIElement>, idx: number) => {
        e.preventDefault();

        // 드래그된 항목의 카테고리의 인덱스를 저장
        selectedCategory = idx; 
    };
    // 드래그 중인 todo(div 태그)가 카테고리(li 태그)를 벗어날 때 호출되는 함수
    const dragLeave = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();

        // 드래그 중인 항목이 카테고리를 벗어나 선택된 카테고리가 없음을 의미하는 -1로 초기화
        selectedCategory = -1;
    };
    // 드래그된 항목이 드랍될 때 호출되는 함수
    const dragDrop = async (e: any) => {
        e.preventDefault();

        // selectedItem과 selectedCategory가 유효한 값일 경우
        // 유효한 값 = todo를 드래그한 상태로 특정 카테고리 위에 드랍 시
        if(selectedItem > -1 && selectedCategory > -1) {
            if(selectedCategory === 1) await todoToActiveAction([Number(selectedItem)]); // 드랍한 카테고리가 Active(1)라면 해당 todo의 completed 속성을 false로 변경
            else if(selectedCategory === 2) await todoToCompletedAction([Number(selectedItem)]); // 드랍한 카테고리가 Completed(2)라면 해당 todo의 completed 속성을 true로 변경 
            categoryChange(); // todo의 completed를 변경한 후 수정된 list를 다시 받아오기 위한 함수
        }
    }
    // 드래그가 끝났을 때 호출되는 함수
    const dragEnd = async (e: React.DragEvent<HTMLDivElement>) => {        
        selectedItem = -1; // todo(div 태그)에 대한 값을 초기화
        selectedCategory = -1; // 카테고리(li 태그)에 대한 값을 초기화
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <ul className="flex justify-around pb-4 border-b-1 border-[#e2e2e2] *:cursor-pointer">
                <li 
                    ref={(el: HTMLLIElement) => {
                        dragOverItem.current[0] = el;
                    }}
                    onDragOver={(e) => dragOver(e, 0)}
                    onDragLeave={(e) => dragLeave(e)}
                    onDrop={(e) => dragDrop(e)}
                    className={`${category == "all" && "selected"}`}
                    onClick={() => setCategory("all")}
                >
                    ALL
                </li>

                <li 
                    ref={(el: HTMLLIElement) => {
                        dragOverItem.current[1] = el;
                    }}
                    onDragOver={(e) => dragOver(e, 1)}
                    onDragLeave={(e) => dragLeave(e)}
                    onDrop={(e) => dragDrop(e)}
                    className={`${category == "Active" && "selected"}`}
                    onClick={() => setCategory("Active")}
                >
                    Active
                </li>

                <li
                    ref={(el: HTMLLIElement) => {
                        dragOverItem.current[2] = el;
                    }}
                    onDragOver={(e) => dragOver(e, 2)}
                    onDragLeave={(e) => dragLeave(e)}
                    onDrop={(e) => dragDrop(e)}
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
                }} dragStart={dragStart} dragEnd={dragEnd} item={item} index={index} onToggle={() => checkTodo(item.id)} />) : <div>There is no todo.</div>}
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