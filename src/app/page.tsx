import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <div className="flex flex-1 items-start justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <TodoApp />
    </div>
  );
}
