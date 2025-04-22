"use server";

import { revalidatePath } from "next/cache";
import { removeItem } from "../data/store";

export async function todoDeleteAction(indexs: number[]) {
    removeItem(indexs);

    revalidatePath("/");
}