import { DragBackground } from "@/components/DragBackground";
import { TodoInputForm } from "@/components/TodoInputForm";
import { TodoList } from "@/components/TodoList";
import { Suspense } from "react";

export default async function Home() {

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#f9f9f9]">
      <div className="flex flex-col gap-8 w-2xl p-10 bg-white rounded-lg shadow-lg">
        <div className="text-3xl text-center font-bold">
          My Todo List
        </div>

        <TodoInputForm />

        <Suspense fallback={<div>로딩 중...</div>}>
          <TodoList />
        </Suspense>
      </div>

      <DragBackground />
    </div>
  );
}