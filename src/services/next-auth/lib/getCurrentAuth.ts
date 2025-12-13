import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm/sql";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/users/db/cache/users";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getCurrentUser({ allData = false } = {}) {
  const session = await getServerSession(authOptions);

  return {
    userId: session?.user?.id,
    user:
      allData && session?.user?.id ? await getUser(session.user.id) : undefined,
  };
}

async function getUser(id: string) {

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
    columns: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
    },
    with: {
      userToRoles: {
        columns: {},
        with: {
          role: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });
}
