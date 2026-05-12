import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { AuthBootstrap } from '@/routes/AuthBootstrap';

export default function App() {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  );
}
