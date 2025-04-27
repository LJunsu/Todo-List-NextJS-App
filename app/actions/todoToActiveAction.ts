"use server";

import { revalidatePath } from "next/cache";
import { toActiveItem } from "../data/store";

export async function todoToActiveAction(indexs: number[]) {
    toActiveItem(indexs);

    revalidatePath("/");
}