import { createBrowserRouter } from "react-router-dom";
import MainLayout from '@/layouts/MainLayout';
import AuthPage from '@features/auth/AuthPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import MovieListPage from "@/features/movies/MovieListPage";
import MovieDetailPage from "@/pages/MovieDetailPage";
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: "phim-moi",
        element: <MovieListPage />
      },
      {
        path: "/phim/:id",
        element: <MovieDetailPage />
      },
      // {
      //   path: "job",
      //   element: <Layout2 />,
      //   children: [
      //     {
      //       path: ":id",
      //       element: <JobSingle />,
      //     },
      //     {
      //       path: "",
      //       element: <Job />,
      //     },
      //   ],
      // },
      // {
      //   path: "messages",
      //   element: (
      //     <PrivateRouter>
      //       <MessagesAdmin />
      //     </PrivateRouter>
      //   ),
      // },
    ],
  },
  {
    path: "auth",
    element: <AuthPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  }

]);
