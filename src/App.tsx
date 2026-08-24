import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { AuthBootstrap } from '@/routes/AuthBootstrap';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
    </ErrorBoundary>
  );
}
