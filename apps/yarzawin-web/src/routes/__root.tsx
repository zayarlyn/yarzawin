import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'
import { Sidebar } from '@yarzawin-web/components/shared/Sidebar'

interface RouterContext {
  queryClient: QueryClient
}

function RootLayout() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="diary-root flex">
          <Sidebar />
          <Outlet />
        </div>
      </Suspense>
      {/* <TanStackRouterDevtools />
      <ReactQueryDevtools /> */}
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})
