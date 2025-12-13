import { NextResponse } from "next/server";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";

export async function GET() {
  const session = await getCurrentUser({ allData: true });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { user } = session;

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const rolesFromDb = user.userToRoles.map((role) => role.role.name);

  return NextResponse.json({ roles: rolesFromDb });
}
