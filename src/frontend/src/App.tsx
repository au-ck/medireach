import { useAuth } from "@/lib/auth";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

function AppRouter() {
  const { isAuthenticated, role } = useAuth();

  router.update({
    context: {
      isAuthenticated,
      role,
    },
  });

  return <RouterProvider router={router} />;
}

export default function App() {
  return <AppRouter />;
}
