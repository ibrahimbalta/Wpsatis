import { syncUser } from '@/lib/user';
import { DashboardClient } from '@/components/DashboardClient';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await syncUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <DashboardClient initialUser={user} />
  );
}
