import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '~/components/Theme';
import AuthRoute from './routes/AuthRoute';
import CrudRoute from './routes/CrudRoute';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import Login from './components/Auth/Login';
import { AuthContextProvider } from '~/hooks/AuthContext';
import TodoRoute from './routes/TodoRoute';
import { router } from './routes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
