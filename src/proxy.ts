import { withAuth } from "next-auth/middleware";
import { db } from "./drizzle/db";
import { UserTable } from "./drizzle/schema";
import { eq } from "drizzle-orm/sql";
import { JWT } from "next-auth/jwt";

interface CustomToken extends JWT {
  id: string;
}

export default withAuth({
  callbacks: {
    authorized: async ({ token, req }) => {
      const path = req.nextUrl.pathname;
      if (!token) return false;
      if (path.startsWith("/admin") || path.startsWith("/partner")) {
        const customToken = token as CustomToken;
        const user = await db.query.UserTable.findFirst({
          where: eq(UserTable.id, customToken.id),
          columns: {},
          with: {
            userToRoles: {
              with: { role: { columns: { name: true } } },
              columns: {},
            },
          },
        });
        if (!user) return false;
        const roles = user.userToRoles.map((ur) => ur.role.name) || [];
        if (path.startsWith("/admin")) {
          return roles.includes("admin");
        }
        return roles.includes("agent")
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/partner/:path*", "/admin/:path*", "/orders/:path*", "/products/:path*", "/enrollment/:path*"],
};
