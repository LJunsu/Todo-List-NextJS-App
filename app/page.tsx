
export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9]">
      <div className="flex flex-col gap-4 w-3/4 p-10 bg-white rounded-lg shadow-lg">
        <div className="text-3xl text-center font-bold">
          My Todo List
        </div>

        <form>
          <input />
          <button>추가</button>
        </form>
      </div>
    </div>
  );
}
