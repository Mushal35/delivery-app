import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { Bike } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavLinks } from "@/features/partner/components/NavLinks";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm/sql";
import { AgentTable } from "@/drizzle/schema";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await getCurrentUser();
  if (!userId) return <div>Not Authenticated</div>;
  const agent = await getAgent(userId);
  if (!agent) return <div>Not Registered</div>;
  return (
    <div className="w-full h-screen bg-slate-50/50 pb-20 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bike className="h-6 w-6 text-indigo-600" />
            Delivery Partner
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            ID: #{agent.id.slice(0, 6)}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-xs uppercase tracking-wide border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse" />
          Online
        </Badge>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6 h-full">
        {/* TABS NAVIGATION */}
        <NavLinks />

        {/* PAGE CONTENT (The Slots) */}
        <main className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500 h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

async function getAgent(userId: string) {
  return await db.query.AgentTable.findFirst({
    where: eq(AgentTable.userId, userId),
    columns: {
      id: true,
    },
  });
}
