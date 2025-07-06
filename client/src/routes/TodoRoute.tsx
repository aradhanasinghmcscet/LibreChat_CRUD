import { Outlet } from "react-router-dom";
import { TodoList } from "../components/Todo/TodoList";
import { useGetStartupConfig } from '~/data-provider';

export default function TodoRoute() {
  const { data: startupConfig, isFetching, error: startupConfigError } = useGetStartupConfig();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Todos</h1>
      <TodoList />
    </div>
  );
}
