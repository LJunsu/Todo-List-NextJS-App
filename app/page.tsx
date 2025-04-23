import { TodoInputForm } from "@/components/TodoInputForm";
import { TodoList } from "@/components/TodoList";

export default async function Home() {

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9]">
      <div className="flex flex-col gap-8 w-2xl p-10 bg-white rounded-lg shadow-lg">
        <div className="text-3xl text-center font-bold">
          My Todo List
        </div>

        <TodoInputForm />

        <TodoList />
      </div>
    </div>
  );
}