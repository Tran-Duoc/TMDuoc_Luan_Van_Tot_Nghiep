import App from '@/App';
import { ClassDetail, CreateExercisePage, ExerciseDetailPage } from '@/pages';

import { Outlet, createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/class-detail/',
    element: <Outlet />,
    children: [
      {
        path: 'create-exercise/:id',
        element: <CreateExercisePage />,
      },

      {
        path: ':id/',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <ClassDetail />,
          },
          {
            path: 'exercise-detail/:id',
            element: <ExerciseDetailPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found</>,
  },
]);
