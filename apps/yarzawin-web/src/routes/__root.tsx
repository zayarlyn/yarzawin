import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Sidebar } from '@yarzawin-web/components/shared/Sidebar'

interface RouterContext {
  queryClient: QueryClient
}

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {pathname === '/login' ? (
        <Outlet />
      ) : (
        <div className="diary-root flex">
          {/* <Sidebar /> */}
          <Outlet />
        </div>
      )}
    </Suspense>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})
