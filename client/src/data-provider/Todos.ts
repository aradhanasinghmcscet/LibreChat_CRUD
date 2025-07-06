import { useQuery, useMutation } from '@tanstack/react-query';

export interface TTodo {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TTodoCreate {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface TTodoUpdate {
  id: string;
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface TTodoFilter {
  status?: string;
}

const API_BASE_URL = 'http://localhost:3080/api';

export const todos = {
  useTodos: (filter?: TTodoFilter, token?: string) => {
    return useQuery<TTodo[]>({
      queryKey: ['todos', filter, token],
      queryFn: async () => {
        const response = await fetch(`${API_BASE_URL}/todos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          ...(filter && { params: filter }),
        });

        if (!response.ok) {
          try {
            // Get the response text
            const responseText = await response.text();
            
            // Try to parse as JSON if it looks like JSON
            if (responseText.trim().startsWith('{')) {
              const errorData = JSON.parse(responseText);
              const errorMessage = errorData.message || 'Failed to fetch todos';
              throw new Error(errorMessage);
            } else {
              // If not JSON, assume it's an HTML error page
              throw new Error(`API server is not running or accessible`);
            }
          } catch (e) {
            // If parsing fails, assume it's an HTML error page
            throw new Error(`API server is not running or accessible`);
          }
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: Expected array of todos');
        }
        return data;
      },
    });
  },

  useCreateTodo: (token?: string) => {
    return useMutation<TTodo, Error, TTodoCreate>({
      mutationFn: async (todo: TTodoCreate) => {
        const response = await fetch(`${API_BASE_URL}/todos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(todo),
        });

        if (!response.ok) {
          try {
            // Try to get the response text first
            const responseText = await response.text();
            
            // Try to parse as JSON if it looks like JSON
            if (responseText.trim().startsWith('{')) {
              const errorData = JSON.parse(responseText);
              const errorMessage = errorData.message || 'Failed to create todo';
              if (response.status === 401) {
                throw new Error('Unauthorized: ' + errorMessage);
              }
              throw new Error(errorMessage);
            } else {
              // If not JSON, just use the full response text
              throw new Error(`HTTP ${response.status}: ${responseText}`);
            }
          } catch (e) {
            // If parsing fails, use the status text
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        }

        return response.json();
      },
    });
  },

  useUpdateTodo: (token?: string) => {
    return useMutation<TTodo, Error, TTodoUpdate>({
      mutationFn: async (todo: TTodoUpdate) => {
        const response = await fetch(`http://localhost:3080/api/todos/${todo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(todo),
        });

        if (!response.ok) {
          try {
            // Try to get the response text first
            const responseText = await response.text();
            
            // Try to parse as JSON if it looks like JSON
            if (responseText.trim().startsWith('{')) {
              const errorData = JSON.parse(responseText);
              const errorMessage = errorData.message || 'Failed to update todo';
              if (response.status === 401) {
                throw new Error('Unauthorized: ' + errorMessage);
              }
              throw new Error(errorMessage);
            } else {
              // If not JSON, just use the full response text
              throw new Error(`HTTP ${response.status}: ${responseText}`);
            }
          } catch (e) {
            // If parsing fails, use the status text
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        }

        return response.json();
      },
    });
  },

  useDeleteTodo: (token?: string) => {
    return useMutation<void, Error, string>({
      mutationFn: async (id: string) => {
        const response = await fetch(`http://localhost:3080/api/todos/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          try {
            // Try to get the response text first
            const responseText = await response.text();
            
            // Try to parse as JSON if it looks like JSON
            if (responseText.trim().startsWith('{')) {
              const errorData = JSON.parse(responseText);
              const errorMessage = errorData.message || 'Failed to delete todo';
              if (response.status === 401) {
                throw new Error('Unauthorized: ' + errorMessage);
              }
              throw new Error(errorMessage);
            } else {
              // If not JSON, just use the full response text
              throw new Error(`HTTP ${response.status}: ${responseText}`);
            }
          } catch (e) {
            // If parsing fails, use the status text
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        }

        return response.json();
      },
    });
  },
};
