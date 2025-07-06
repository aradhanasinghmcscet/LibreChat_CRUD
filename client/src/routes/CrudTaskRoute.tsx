import { Outlet } from "react-router-dom";
import { AuthLayout } from "../components/Auth/AuthLayout";
import { CrudTable } from "../components/CrudTask/CrudTable";
import { useCrudTasks, useCreateCrudTask, useUpdateCrudTask, useDeleteCrudTask } from "~/data-provider/CrudTask";

export default function CrudTaskRoute() {
  const { data: crudTasks, isLoading } = useCrudTasks();
  const createCrudTask = useCreateCrudTask();
  const updateCrudTask = useUpdateCrudTask();
  const deleteCrudTask = useDeleteCrudTask();

  return (
    <AuthLayout
      header={<h1 className="text-3xl font-bold">Crud Tasks</h1>}
      isFetching={isLoading}
      startupConfig={{}}
      startupConfigError={null}
      pathname="/crud-tasks"
      error={null}
    >
      <div className="container mx-auto py-8">
        <CrudTable
          data={crudTasks || []}
          title="Task"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description' },
            { key: 'status', label: 'Status', type: 'select', options: ['pending', 'in-progress', 'completed'] },
            { key: 'createdAt', label: 'Created At', type: 'date' },
            { key: 'updatedAt', label: 'Updated At', type: 'date' }
          ]}
          onAdd={(data) => createCrudTask.mutate(data as any)}
          onUpdate={(data) => updateCrudTask.mutate(data as any)}
          onDelete={(id) => deleteCrudTask.mutate(id)}
          getRowId={(item) => item.id}
        />
      </div>
    </AuthLayout>
  );
}
