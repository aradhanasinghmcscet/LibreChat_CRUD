import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthContextProvider } from '~/hooks/AuthContext';
import {
  Login,
  VerifyEmail,
  Registration,
  ResetPassword,
  TwoFactorScreen,
  RequestPasswordReset,
} from '~/components/Auth';
import { OAuthSuccess, OAuthError } from '~/components/OAuth';

import RouteErrorBoundary from './RouteErrorBoundary';
import StartupLayout from './Layouts/Startup';
import LoginLayout from './Layouts/Login';
import dashboardRoutes from './Dashboard';
import ShareRoute from './ShareRoute';
import ChatRoute from './ChatRoute';
import Search from './Search';
import Root from './Root';
import CrudRoute from './CrudRoute';
import TodoRoute from './TodoRoute';

const AuthLayout = () => (
  <AuthContextProvider authConfig={undefined}>
    <Outlet />
  </AuthContextProvider>
);

export const router = createBrowserRouter([
  {
    path: 'share/:shareId',
    element: <ShareRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: 'oauth',
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'success',
        element: <OAuthSuccess />,
      },
      {
        path: 'error',
        element: <OAuthError />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'register',
        element: <Registration />,
      },
      {
        path: 'forgot-password',
        element: <RequestPasswordReset />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: '/',
        element: <LoginLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'login/2fa',
            element: <TwoFactorScreen />,
          },
        ],
      },
      dashboardRoutes,
      {
        path: 'dashboard',
        element: <Root />,
        children: [
          {
            index: true,
            element: <Navigate to="/c/new" replace={true} />,
          },
          {
            path: 'c/:conversationId?',
            element: <ChatRoute />,
          },
          {
            path: 'search',
            element: <Search />,
          },
        ],
      },
    ],
  },
  {
    path: 'todos',
    element: <TodoRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: 'crud',
    element: <CrudRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="list" replace={true} />,
      },
      {
        path: 'list',
        element: <div>CRUD List View</div>,
      },
      {
        path: 'create',
        element: <div>CRUD Create Form</div>,
      },
      {
        path: 'edit/:id',
        element: <div>CRUD Edit Form</div>,
      },
      {
        path: 'view/:id',
        element: <div>CRUD View Details</div>,
      },
    ],
  }
]);
