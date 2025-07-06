import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { cn } from "@/components/ui/utils";

interface CrudTableProps<T> {
  data: T[];
  title: string;
  columns: {
    key: string;
    label: string;
    type?: 'text' | 'date' | 'select';
    options?: string[];
  }[];
  onAdd: (data: Partial<T>) => void;
  onUpdate: (data: Partial<T>) => void;
  onDelete: (id: string) => void;
  getRowId: (item: T) => string;
}

export function CrudTable<T>({ 
  data, 
  title, 
  columns, 
  onAdd, 
  onUpdate, 
  onDelete,
  getRowId
}: CrudTableProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [newItem, setNewItem] = useState<Partial<T>>({});

  const handleAdd = () => {
    if (onAdd) {
      onAdd(newItem);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add {title}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {columns.map((column) => (
                <div key={column.key} className="space-y-2">
                  <label htmlFor={column.key} className="text-sm font-medium">
                    {column.label}
                  </label>
                  {column.type === 'select' ? (
                    <Select
                      value={newItem[column.key as keyof T] as string}
                      onValueChange={(value) => 
                        setNewItem({ ...newItem, [column.key]: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${column.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {column.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={column.key}
                      value={
                        editItem ? 
                          (editItem as any)[column.key] 
                          : (newItem as any)[column.key]
                      }
                      onChange={(e) => 
                        setNewItem({ ...newItem, [column.key]: e.target.value })
                      } as any
                      placeholder={`Enter ${column.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
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
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={getRowId(item)}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.type === 'date'
                    ? new Date(item[column.key as keyof T] as string).toLocaleString()
                    : column.type === 'select'
                    ? (item[column.key as keyof T] as string).replace(/-/g, ' ').charAt(0).toUpperCase() + 
                      (item[column.key as keyof T] as string).replace(/-/g, ' ').slice(1)
                    : item[column.key as keyof T]}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditItem(item);
                      setNewItem(item);
                      setIsOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(getRowId(item))}
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
