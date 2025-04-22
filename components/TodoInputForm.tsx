"use client";

import { todoAction } from "@/app/actions/todoAction";
import { useActionState, useEffect, useState } from "react";

export function TodoInputForm() {
    const [state, action] = useActionState(todoAction, null);
    const [error, setError] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        if(state?.fieldErrors) setError(state.fieldErrors.todoContent);
    }, [state]);

    return (
        <form action={action} className="flex justify-between items-center gap-4 w-full">
            <div className="flex flex-col gap-2 w-5/6">
                <textarea
                    name="todoContent"
                    placeholder="할 일을 입력하세요."
                    rows={1}
                    required minLength={3} maxLength={200}
                    onFocus={() => setError(undefined)}
                    className="px-2 py-2 border-2 border-[#e2e2e2] rounded-lg resize-none"
                />

                {
                    error && 
                        <span className="text-xs text-red-500">
                            {error}
                        </span>
                }
            </div>

            <button className="w-1/6 h-12 bg-[#4E89FF] text-white rounded-lg cursor-pointer duration-200 hover:bg-[#366EDD]">
                Add
            </button>
        </form>
    );
}