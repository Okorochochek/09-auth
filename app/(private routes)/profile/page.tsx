import css from './ProfilePage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getMeServer } from '@/lib/api/serverApi';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Explore your profile information here',
  openGraph: {
    title: 'Profile',
    description:
      'Manage your profile, update personal details, and customize account settings easily.',
    url: 'http://localhost:3000/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Profile',
      },
    ],
  },
};

async function Profile() {
  const user = await getMeServer();

  if (user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>
          <div className={css.avatarWrapper}>
            <Image
              src={user.avatar ?? ''}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: {user.username}</p>
            <p>Email: {user?.email}</p>
          </div>
        </div>
      </main>
    );
  }

  return <p>Sorry we could not find user`&apos;`s information </p>;
}

export default Profile;