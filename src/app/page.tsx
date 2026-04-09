import { syncUser } from '@/lib/user';
import { DashboardClient } from '@/components/DashboardClient';
import { redirect } from 'next/navigation';

export default async function Page() {
  // Sync user with DB
  const user = await syncUser();

  // If sync fails or no user session, Clerk usually handles redirect via middleware,
  // but if we are here and still no user, we redirect manually.
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <DashboardClient initialUser={user} />
  );
}
