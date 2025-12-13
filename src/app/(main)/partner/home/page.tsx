import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  IndianRupee,
  Package,
  Navigation,
  CheckCircle2,
  Bike,
} from "lucide-react";
import { DashboardLiveUpdater } from "@/hooks/dashboard-live-updater";
import { db } from "@/drizzle/db";
import { isNull } from "drizzle-orm/sql";
import { OrderTable } from "@/drizzle/schema";

import { redirect } from "next/navigation";

export default function DashboardRootPage() {
  redirect("/partner/home/available");
}

// export default async function DeliveryDashboard() {
//   const { userId } = await getCurrentUser();
//   if (!userId)
//     return (
//       <div className="p-10 text-center text-red-500">Not Authenticated</div>
//     );

//   const { available, active, completed } = await getDeliveryDashboardData(
//     userId
//   );

//   return (
//     <div className="flex-1 bg-slate-50/50 pb-20 font-sans overflow-y-auto">
//       <DashboardLiveUpdater />
//       {/* 1. TOP BAR: Status & Identity */}
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
//         <div>
//           <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//             <Bike className="h-6 w-6 text-indigo-600" />
//             Delivery Partner
//           </h1>
//           <p className="text-xs text-slate-500 font-medium">
//             ID: #{userId.slice(0, 6)}
//           </p>
//         </div>
//         <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 text-xs uppercase tracking-wide border-green-200">
//           <span className="w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse" />
//           Online
//         </Badge>
//       </header>

//       <div className="max-w-md mx-auto p-4 space-y-6">
//         {/* 3. MAIN TABS */}
//         <Tabs defaultValue="available" className="w-full">
//           <TabsList className="grid w-full grid-cols-3 bg-slate-200/50 p-1 h-12 rounded-xl mb-6">
//             <TabsTrigger
//               value="available"
//               className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
//             >
//               New ({available.length})
//             </TabsTrigger>
//             <TabsTrigger
//               value="active"
//               className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
//             >
//               Active ({active.length})
//             </TabsTrigger>
//             <TabsTrigger
//               value="completed"
//               className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
//             >
//               History
//             </TabsTrigger>
//           </TabsList>

//           {/* TAB 1: AVAILABLE */}
//           <TabsContent
//             value="available"
//             className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2"
//           >
//             {available.length === 0 ? (
//               <EmptyState label="No new orders nearby" />
//             ) : (
//               available.map((order) => (
//                 <Card
//                   key={order.id}
//                   className="overflow-hidden border-slate-200 hover:border-indigo-300 transition-all shadow-sm"
//                 >
//                   <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
//                     <span className="text-xs font-mono text-slate-500">
//                       #{order.id.slice(0, 8)}
//                     </span>
//                     <Badge
//                       variant="secondary"
//                       className="bg-white border-slate-200 text-slate-600 font-normal gap-1"
//                     >
//                       <Clock className="h-3 w-3" /> 2m ago
//                     </Badge>
//                   </div>
//                   <CardContent className="p-4 space-y-4">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
//                           Total Pay
//                         </p>
//                         <p className="text-xl font-bold text-slate-900 flex items-center">
//                           <IndianRupee className="h-4 w-4 mr-0.5 text-slate-400" />
//                           {order.totalAmount}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
//                           Distance
//                         </p>
//                         <p className="text-sm font-medium">2.4 km</p>
//                       </div>
//                     </div>

//                     <div className="flex gap-3 items-start p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
//                       <MapPin className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-xs text-indigo-600 font-semibold mb-0.5">
//                           Pickup Location
//                         </p>
//                         <p className="text-sm text-slate-700 leading-snug">
//                           {order.address?.addressLine}
//                         </p>
//                       </div>
//                     </div>
//                   </CardContent>
//                   <CardFooter className="p-3 pt-0">
//                     <form className="w-full">
//                       <Button
//                         size="lg"
//                         className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 font-semibold"
//                       >
//                         Accept Order
//                       </Button>
//                     </form>
//                   </CardFooter>
//                 </Card>
//               ))
//             )}
//           </TabsContent>

//           {/* TAB 2: ACTIVE */}
//           <TabsContent
//             value="active"
//             className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2"
//           >
//             {active.length === 0 ? (
//               <EmptyState label="No active deliveries" />
//             ) : (
//               active.map((order) => (
//                 <Card
//                   key={order.id}
//                   className="overflow-hidden border-blue-200 shadow-md ring-1 ring-blue-100"
//                 >
//                   <div className="bg-blue-600 px-4 py-3 text-white flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                       <div className="p-1 bg-white/20 rounded">
//                         <Package className="h-4 w-4" />
//                       </div>
//                       <span className="font-semibold">In Progress</span>
//                     </div>
//                     <span className="font-mono text-xs opacity-80">
//                       #{order.id.slice(0, 8)}
//                     </span>
//                   </div>

//                   <CardContent className="p-5 space-y-6">
//                     {/* Progress visual */}
//                     <div className="flex items-center justify-between text-xs font-medium text-slate-500">
//                       <span>Picked Up</span>
//                       <span className="text-blue-600">On the way</span>
//                       <span>Delivered</span>
//                     </div>
//                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//                       <div className="h-full w-2/3 bg-blue-500 rounded-full" />
//                     </div>

//                     <div className="space-y-4">
//                       <div className="flex gap-3">
//                         <div className="flex flex-col items-center gap-1">
//                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                             <MapPin className="h-4 w-4" />
//                           </div>
//                           <div className="w-0.5 h-full bg-slate-200" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-slate-400 uppercase">
//                             Drop Location
//                           </p>
//                           <p className="text-sm font-medium text-slate-900">
//                             {order.address?.addressLine}
//                           </p>
//                           <p className="text-xs text-slate-500 mt-1">
//                             PIN: {order.address?.pincode}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>

//                   <CardFooter className="p-4 bg-slate-50 flex gap-3">
//                     <Button
//                       variant="outline"
//                       className="flex-1 border-slate-300"
//                     >
//                       <Navigation className="h-4 w-4 mr-2" /> Map
//                     </Button>
//                     <form className="flex-1">
//                       <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm">
//                         Mark Delivered
//                       </Button>
//                     </form>
//                   </CardFooter>
//                 </Card>
//               ))
//             )}
//           </TabsContent>

//           {/* TAB 3: HISTORY */}
//           <TabsContent
//             value="completed"
//             className="space-y-3 animate-in fade-in-50 slide-in-from-bottom-2"
//           >
//             {completed.map((order) => (
//               <Card
//                 key={order.id}
//                 className="flex flex-row items-center p-4 border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
//               >
//                 <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
//                   <CheckCircle2 className="h-5 w-5" />
//                 </div>
//                 <div className="ml-4 flex-1">
//                   <p className="text-sm font-medium text-slate-900">
//                     Order #{order.id.slice(0, 8)}
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-bold text-slate-900">
//                     ₹{order.totalAmount}
//                   </p>
//                   <p className="text-xs text-green-600 font-medium">Paid</p>
//                 </div>
//               </Card>
//             ))}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-slate-100 p-4 rounded-full mb-3">
        <Bike className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-sm font-medium text-slate-900">{label}</h3>
      <p className="text-xs text-slate-500 max-w-[200px] mt-1">
        Refresh the page to check for new updates.
      </p>
    </div>
  );
}

// ... Keep your mock data function exactly the same ...
// Mock data generator
async function getDeliveryDashboardData(driverId: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    available: [
      {
        id: "ord_123abc_available",
        totalAmount: "1200.00",
        createdAt: new Date("2025-12-14T10:00:00"),
        orderStatuses: [{ status: "packed" }],
        address: {
          addressLine: "101, Galaxy Apartments, Linking Road, Mumbai",
          pincode: "400050",
        },
      },
      {
        id: "ord_456def_available",
        totalAmount: "850.50",
        createdAt: new Date("2025-12-14T11:30:00"),
        orderStatuses: [{ status: "packed" }],
        address: {
          addressLine: "Flat 4B, Sunshine Towers, Andheri West",
          pincode: "400053",
        },
      },
    ],
    active: [
      {
        id: "ord_789ghi_active",
        totalAmount: "2400.00",
        createdAt: new Date("2025-12-14T09:00:00"),
        orderStatuses: [{ status: "assigned" }],
        address: {
          addressLine: "Sector 4, Vashi, Navi Mumbai",
          pincode: "400703",
        },
      },
    ],
    completed: [
      {
        id: "ord_000xyz_done",
        totalAmount: "500.00",
        createdAt: new Date("2025-12-10T14:20:00"),
        orderStatuses: [{ status: "delivered" }],
        address: {
          addressLine: "Bandra Kurla Complex, Mumbai",
          pincode: "400051",
        },
      },
      {
        id: "ord_111abc_done",
        totalAmount: "150.00",
        createdAt: new Date("2025-12-09T18:45:00"),
        orderStatuses: [{ status: "delivered" }],
        address: {
          addressLine: "Powai Plaza, Hiranandani",
          pincode: "400076",
        },
      },
    ],
  };
}

async function getAvailableOrders() {
  const orders = await db.query.OrderTable.findMany({
    where: isNull(OrderTable.agentId),
    columns: { payment: true, createdAt: true, totalAmount: true },
    with: {
      address: {
        columns: {
          addressLine: true,
          pincode: true,
        },
      },
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
      orderStatuses: {
        orderBy: (row, { desc }) => [desc(row.createdAt)],
        limit: 1,
        columns: {
          status: true,
        },
      },
    },
  });
  const data = orders.map((order) => {
    const { orderStatuses, ...rest } = order;
    return { ...rest, status: orderStatuses[0].status };
  });
  return data;
}
