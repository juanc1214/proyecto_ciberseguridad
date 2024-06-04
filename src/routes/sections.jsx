import { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app')); 
export const Subastas = lazy(() => import('src/pages/subastas'));
export const Ofertar = lazy(() => import('src/pages/ofertar'));

export default function Router({ account, contract }) {
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
        { element: <IndexPage contract={contract} />, index: true },
        { path: 'subastas', element: <Subastas account={account} contract={contract} /> },
        { path: 'ofertar', element: <Ofertar account={account} contract={contract} /> },
      ],
    }
  ]);

  return routes;
}
