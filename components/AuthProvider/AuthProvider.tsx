'use client'

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode;
};

function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const getUser = async () => {
      const isAuthenticated = await checkSession();

      if (isAuthenticated) {
        const user = await getMe();

        if (user) setUser(user);

        if (!user) clearIsAuthenticated();
      }
    };

    getUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
}
export default AuthProvider;