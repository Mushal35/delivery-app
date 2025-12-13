import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register a standard font
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf",
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#333" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#111" },
  subtitle: { fontSize: 10, color: "#666", marginTop: 4 },
  section: { marginBottom: 20 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  col1: { width: "50%" },
  col2: { width: "15%", textAlign: "right" },
  col3: { width: "15%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  bold: { fontWeight: "bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
});

// Helper for currency formatting in PDF (Intl might not work in all PDF runtimes, safe simple version)
const formatMoney = (amount: string) => `Rs. ${parseFloat(amount).toFixed(2)}`;

export const InvoicePDF = ({
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
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>Order ID: {order.id}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Addresses */}
      <View
        style={[
          styles.section,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <View style={{ width: "45%" }}>
          <Text style={[styles.bold, { marginBottom: 4 }]}>Billed To:</Text>
          {order.address ? (
            <>
              <Text>{order.address.addressLine}</Text>
              <Text>PIN: {order.address.pincode}</Text>
            </>
          ) : (
            <Text>No address provided</Text>
          )}
        </View>
        <View style={{ width: "45%", alignItems: "flex-end" }}>
          <Text style={[styles.bold, { marginBottom: 4 }]}>Payment Info:</Text>
          <Text>
            Method:{" "}
            {order.payment === "online" ? "Online Payment" : "Cash on Delivery"}
          </Text>
          <Text>Total: {formatMoney(order.totalAmount)}</Text>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.col1, { paddingLeft: 8 }]}>Item</Text>
        <Text style={styles.col2}>Price</Text>
        <Text style={styles.col3}>Qty</Text>
        <Text style={styles.col4}>Total</Text>
      </View>

      {/* Table Rows */}
      {order.items.map((item, i) => (
        <View key={i} style={styles.row}>
          <Text style={[styles.col1, { paddingLeft: 8 }]}>{item.name}</Text>
          <Text style={styles.col2}>{formatMoney(item.unitPrice)}</Text>
          <Text style={styles.col3}>{item.quantity}</Text>
          <Text style={styles.col4}>{formatMoney(item.subTotal)}</Text>
        </View>
      ))}

      {/* Total Section */}
      <View style={styles.totalRow}>
        <View
          style={{
            width: "40%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.bold}>Grand Total:</Text>
          <Text style={[styles.bold, { fontSize: 14 }]}>
            {formatMoney(order.totalAmount)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);
