import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './routers/init.tsx';
import { RouterProvider } from 'react-router-dom';

import './index.css';
import { Toaster } from './components/ui/sonner.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
