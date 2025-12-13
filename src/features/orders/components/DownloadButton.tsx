"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoicePDF } from "./InvoicePdf";

export function DownloadInvoiceButton({
  order,
}: {
  order: {
    id: string;
    createdAt: Date;
    totalAmount: string;
    payment: "online" | "offline";
    address: {
      addressLine: string;
      pincode: string;
    };
    items: {
      name: string;
      imageUrl: string;
      category: string;
      quantity: string;
      unitPrice: string;
      subTotal: string;
    }[];
  };
}) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF order={order} />}
      fileName={`invoice-${order.id}.pdf`}
    >
      {/* The render prop gives us the loading state of the PDF generation.
         We use this to show a spinner while the browser draws the PDF.
      */}
      {({ loading }) => (
        <Button
          variant="outline"
          className="gap-2 w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? "Generating..." : "Download Invoice"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
