"use server";

import { revalidatePath } from "next/cache";
import { toCompletedItem } from "../data/store";

export async function todoToCompletedAction(indexs: number[]) {
    toCompletedItem(indexs);

    revalidatePath("/");
}