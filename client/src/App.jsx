import { RecoilRoot } from 'recoil';
import { DndProvider } from 'react-dnd';
import { RouterProvider, Outlet } from 'react-router-dom';
import * as RadixToast from '@radix-ui/react-toast';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ScreenshotProvider, ThemeProvider, useApiErrorBoundary } from './hooks';
import { ToastProvider } from './Providers';
import Toast from './components/ui/Toast';
import { LiveAnnouncer } from '~/a11y';
import { router } from './routes';
import { AuthContextProvider } from './hooks/AuthContext';

const App = () => {
  const { setError } = useApiErrorBoundary();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error?.response?.status === 401) {
          setError(error);
        }
      },
    }),
  });

  return (
    <RecoilRoot>
      <ScreenshotProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}>
            <AuthContextProvider authConfig={undefined}>
              <LiveAnnouncer>
                <ThemeProvider>
                  <RadixToast.Provider>
                    <ToastProvider>
                      <DndProvider backend={HTML5Backend}>
                        <Outlet />
                      </DndProvider>
                      <Toast />
                    </ToastProvider>
                  </RadixToast.Provider>
                </ThemeProvider>
              </LiveAnnouncer>
            </AuthContextProvider>
          </RouterProvider>
        </QueryClientProvider>
      </ScreenshotProvider>
    </RecoilRoot>
  );
};

export default App;
