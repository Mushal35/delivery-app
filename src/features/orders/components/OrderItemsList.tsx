import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../utils/formatter";

export function OrderItemsList({
  items,
}: {
  items: {
    name: string;
    imageUrl: string;
    category: string;
    quantity: string;
    unitPrice: string;
    subTotal: string;
  }[];
}) {
  return (
    <Card className="overflow-hidden border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-lg">Items in your order</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex gap-4 p-6 hover:bg-slate-50/50 transition-colors">
              {/* Product Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500">{item.category}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(item.unitPrice)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {index < items.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
