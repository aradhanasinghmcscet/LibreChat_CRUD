import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { cn } from "@/components/ui/utils";

import { TTodo, TTodoCreate, TTodoUpdate } from "~/data-provider/Todos";

interface TodoTableProps {
  data: TTodo[];
  onAdd: (todo: TTodoCreate) => void;
  onUpdate: (todo: TTodoUpdate) => void;
  onDelete: (id: string) => void;
}

export function TodoTable({ data, onAdd, onUpdate, onDelete }: TodoTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<TTodo | null>(null);
  const [newItem, setNewItem] = useState<Partial<TTodo>>({});

  const handleAdd = () => {
    if (onAdd) {
      const todoData = {
        title: newItem.title || '',
        description: newItem.description || '',
        status: newItem.status || 'pending'
      };
      onAdd(todoData);
      setNewItem({});
      setIsOpen(false);
    }
  };

  const handleUpdate = () => {
    if (editItem && onUpdate) {
      onUpdate({ ...editItem, ...newItem });
      setEditItem(null);
      setNewItem({});
      setIsOpen(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    const todo = data.find(todo => todo.id === id);
    if (todo && onUpdate) {
      onUpdate({ ...todo, status: newStatus });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Todo List</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add Todo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={newItem.title || editItem?.title || ""}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  value={newItem.description || editItem?.description || ""}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editItem ? handleUpdate : handleAdd}>
                  {editItem ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.description}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(todo.id, todo.status === 'pending' ? 'in-progress' : todo.status === 'in-progress' ? 'completed' : 'pending')}
                  className={cn(
                    "px-4",
                    todo.status === 'pending' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
                    todo.status === 'in-progress' && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                    todo.status === 'completed' && "bg-green-100 text-green-800 hover:bg-green-200"
                  )}
                >
                  {todo.status.replace(/-/g, ' ').charAt(0).toUpperCase() + todo.status.replace(/-/g, ' ').slice(1)}
                </Button>
              </TableCell>
              <TableCell>{new Date(todo.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditItem(todo);
                      setNewItem(todo);
                      setIsOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(todo.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
