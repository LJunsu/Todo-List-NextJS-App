"use server";

import { getActiveItems, getCompletedItems, getItems, TodoType } from "../data/store";

export async function getTodo(category: string) {
    let items: TodoType[];

    if(category == "completed") {
        items = await getCompletedItems();
    } else if(category == "Active") {
        items = await getActiveItems();
    } else {
        items = await getItems();
    }

    return items;
}