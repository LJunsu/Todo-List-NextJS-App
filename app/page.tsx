import { TodoInputForm } from "@/components/TodoInputForm";
import { getItems } from "./data/store";
import { TodoList } from "@/components/TodoList";

export default async function Home() {
  const todoList = await getItems();

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9]">
      <div className="flex flex-col gap-8 min-w-2xl p-10 bg-white rounded-lg shadow-lg">
        <div className="text-3xl text-center font-bold">
          My Todo List
        </div>

        <TodoInputForm />

        <TodoList list={todoList} />
      </div>
    </div>
  );
}