import { useTodoStore } from "@/store/todoStore";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export function AfterSubmitEffect() {
    // useFormStatus - React에서 폼 제출 상태를 추적하는 Hook
    const {pending} = useFormStatus();
    const {triggerRefresh} = useTodoStore();

    // 폼이 제출 중일 때 pending -> true
    // server action이 끝나면 pending -> false
    useEffect(() => {
        if(!pending) triggerRefresh();
    }, [pending]);

    return null;
}