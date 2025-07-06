import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { TodoTable } from "./TodoTable";
import { useRecoilState } from "recoil";
import { statusFilterAtom } from "../../store/todoAtoms";
import { todos, TTodo, TTodoCreate, TTodoUpdate } from '~/data-provider/Todos';


export function TodoList() {
  const [statusFilter, setStatusFilter] = useRecoilState(statusFilterAtom);
  const [error, setError] = useState<string | null>(null);
  const token = null;
  const { data: todosData, isLoading, error: queryError } = todos.useTodos({ status: statusFilter });
  const { mutate: createTodo } = todos.useCreateTodo();
  const { mutate: updateTodo } = todos.useUpdateTodo();
  const { mutate: deleteTodo } = todos.useDeleteTodo();

  const validateTodo = (todo: TTodoCreate) => {
    if (!todo.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (todo.title.length > 100) {
      setError('Title must be less than 100 characters');
      return false;
    }
    if (todo.description && todo.description.length > 500) {
      setError('Description must be less than 500 characters');
      return false;
    }
    if (todo.status && !['pending', 'in-progress', 'completed'].includes(todo.status)) {
      setError('Invalid status. Must be one of: pending, in-progress, completed');
      return false;
    }
    setError(null);
    return true;
  };

  const handleAdd = (todo: TTodoCreate) => {
    if (!validateTodo(todo)) return;
    
    createTodo(todo, {
      onSuccess: () => {
        setError(null);
      },
      onError: () => {
        setError('Failed to create todo');
      },
    });
  };

  const handleUpdate = (updatedTodo: TTodoUpdate) => {
    if (!updatedTodo.id) {
      setError('Invalid todo ID');
      return;
    }

    updateTodo(updatedTodo, {
      onSuccess: () => {
        setError(null);
      },
      onError: () => {
        setError('Failed to update todo');
      },
    });
  };

  const handleDelete = (id: string) => {
    if (!id) {
      setError('Invalid todo ID');
      return;
    }

    deleteTodo(id, {
      onSuccess: () => {
        setError(null);
      },
      onError: () => {
        setError('Failed to delete todo');
      },
    });
  };

  const filteredTodos = todosData || [];

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Todos</h2>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'pending' | 'in-progress' | 'completed')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {filteredTodos.length} {filteredTodos.length === 1 ? 'todo' : 'todos'}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({filteredTodos.filter(t => t.status === 'pending').length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter('in-progress')}
          >
            In Progress ({filteredTodos.filter(t => t.status === 'in-progress').length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({filteredTodos.filter(t => t.status === 'completed').length})
          </Button>
        </div>
      </div>

      <TodoTable
        data={filteredTodos}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
