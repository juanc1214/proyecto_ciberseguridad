import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app')); 
export const Subastas = lazy(() => import('src/pages/subastas'));
export const Ofertar = lazy(() => import('src/pages/ofertar'));



// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'subastas', element: <Subastas /> },
        { path: 'ofertar', element: <Ofertar /> },
      ],
    }
  ]);

  return routes;
}
