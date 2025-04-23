"use server";

import { revalidatePath } from "next/cache";
import { completedItem } from "../data/store";

export async function todoCompletedAction(indexs: number[]) {
    completedItem(indexs);

    revalidatePath("/");
}