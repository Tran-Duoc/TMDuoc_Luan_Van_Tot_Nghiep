import App from '@/App';
import ClassDetail from '@/pages/ClassDetail';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    
  },
  {
    path: '/class-detail/:id',
    element: <ClassDetail />,
  },
]);
