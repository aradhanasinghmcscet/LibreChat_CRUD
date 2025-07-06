import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TCrudTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface TCrudTaskCreate {
  title: string;
  description: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

interface TCrudTaskUpdate extends Partial<TCrudTaskCreate> {
  id: string;
}

export const crudTasks = {
  getCrudTasks: async (status?: 'pending' | 'in-progress' | 'completed') => {
    const response = await api.get<TCrudTask[]>('/crud-tasks', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  createCrudTask: async (data: TCrudTaskCreate) => {
    const response = await api.post<TCrudTask>('/crud-tasks', data);
    return response.data;
  },

  updateCrudTask: async (data: TCrudTaskUpdate) => {
    const response = await api.put<TCrudTask>(`/crud-tasks/${data.id}`, data);
    return response.data;
  },

  deleteCrudTask: async (id: string) => {
    await api.delete(`/crud-tasks/${id}`);
  },
};

export function useCrudTasks(status?: 'pending' | 'in-progress' | 'completed') {
  return useQuery<TCrudTask[]>(
    ['crud-tasks', status],
    () => crudTasks.getCrudTasks(status),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
}

export function useCreateCrudTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TCrudTaskCreate) => crudTasks.createCrudTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['crud-tasks']);
    },
  });
}

export function useUpdateCrudTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TCrudTaskUpdate) => crudTasks.updateCrudTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['crud-tasks']);
    },
  });
}

export function useDeleteCrudTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => crudTasks.deleteCrudTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['crud-tasks']);
    },
  });
}
