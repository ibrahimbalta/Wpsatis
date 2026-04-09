import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function syncUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    // Check if user exists in DB
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (existingUser) return existingUser;

    // If not, get full info from Clerk and create in DB
    const user = await currentUser();
    if (!user) {
      // Sometimes currentUser() is null even if userId exists (edge cases)
      // We can create a basic record first and update it later if needed
      const [newUser] = await db.insert(users).values({
        clerkId: userId,
        email: 'pending@clerk.user', // Fallback email
        name: 'Yeni Kullanıcı',
        selectedSectorId: 'emlak', 
      }).returning();
      return newUser;
    }

    const [newUser] = await db.insert(users).values({
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Kullanıcı',
      selectedSectorId: 'emlak',
    }).returning();

    return newUser;
  } catch (error) {
    console.error('syncUser error:', error);
    return null;
  }
}
