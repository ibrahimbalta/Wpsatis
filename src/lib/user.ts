import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // Check if user exists in DB
  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (existingUser) return existingUser;

  // If not, get full info from Clerk and create in DB
  const user = await currentUser();
  if (!user) return null;

  const newUser = await db.insert(users).values({
    clerkId: userId,
    email: user.emailAddresses[0].emailAddress,
    name: `${user.firstName} ${user.lastName}`,
    selectedSectorId: '1', // Default to Seramik
  }).returning();

  return newUser[0];
}
