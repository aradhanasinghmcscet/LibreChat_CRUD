import { Outlet } from 'react-router-dom';
import AuthLayout from '../components/Auth/AuthLayout';
import { useGetStartupConfig } from '~/data-provider';

export default function AuthRoute() {
  const { data: startupConfig, isFetching, error: startupConfigError } = useGetStartupConfig();

  return (
    <AuthLayout
      header={<h2 className="text-3xl font-bold">Login</h2>}
      isFetching={isFetching}
      startupConfig={startupConfig}
      startupConfigError={startupConfigError}
      pathname="/login"
      error={null}
    >
      <div className="container mx-auto py-8">
        <Outlet />
      </div>
    </AuthLayout>
  );
}
