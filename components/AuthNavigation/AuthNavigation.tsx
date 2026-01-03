'use client';

import css from './AuthNavigation.module.css';
import Link from 'next/link';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.push('/sign-in');
  };

  return isAuthenticated ?(
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button
              className={css.logoutButton}
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              className={css.navigationLink}
              href="/sign-in"
              prefetch={false}
            >
              Sign-in
            </Link>
          </li>
          <li>
            <Link
              className={css.navigationLink}
              href="/sign-up"
              prefetch={false}
            >
              Sign-up
            </Link>
          </li>
        </>
      );
};

export default AuthNavigation;