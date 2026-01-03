'use client';

import css from './EditProfilePage.module.css';
import Image from 'next/image';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

export default function EditProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const setUser = useAuthStore((s) => s.setUser);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (userData: { username: string }) => updateMe(userData),

    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/profile');
    },

    onError: (error) => console.log(error.message ? error.message : error),
  });

  const handleSubmit = (formData: FormData) => {
    const username = (formData.get('username') as string).trim();

    if (!username) {
      alert('Invalid username');
      return;
    }
    console.log(username);

    mutate({ username: username });
  };

  const handleCancel = () => router.push('/profile');

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user?.avatar || '/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form action={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username"
              type="text"
              className={css.input}
              defaultValue={user?.username}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              disabled={isPending}
              className={css.saveButton}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

