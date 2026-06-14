import { Outlet } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { ROUTES } from "@/constants/routes";
import { AppProviders } from "./app/providers";
import { Wedding, Classic } from "./pages";

/** Root layout — AppProviders (QueryClient + Helmet + Toaster) bọc route tree. */
function RootLayout() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

export const routes: RouteRecord[] = [
  {
    path: ROUTES.home,
    element: <RootLayout />,
    entry: "client/routes.tsx",
    children: [
      { index: true, element: <Wedding />, entry: "client/pages/Wedding.tsx" },
      {
        path: ROUTES.classic,
        element: <Classic />,
        entry: "client/pages/Classic.tsx",
      },
    ],
  },
];
