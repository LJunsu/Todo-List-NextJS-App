"use server"

import { z } from "zod";
import { addItem } from "../data/store";
import { revalidatePath } from "next/cache";

const todoSchema = z.object({
    todoContent: z
        .string()
        .min(3, {
            message: "최소 3글자 이상 입력하세요."
        })
        .max(200, {
            message: "최대 200글자 까지 입력할 수 있습니다."
        })
});

export async function todoAction(_: unknown, formData: FormData) {
    const data = {
        todoContent: formData.get("todoContent")
    };

    const result = todoSchema.safeParse(data);
    if(!result.success) {
        return result.error.flatten();
    } else {
        await addItem(result.data.todoContent);

        revalidatePath("/");
    }
}