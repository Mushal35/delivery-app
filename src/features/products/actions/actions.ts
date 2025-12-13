"use server";

import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import type z from "zod";
import { productsSchema } from "./schemas";
import { db } from "@/drizzle/db";
import {
  OrderTable,
  OrderItemTable,
  OrderStatusTable,
  ProductTable,
} from "@/drizzle/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { eventBus } from "@/lib/event-bus";

type StockErrorItem = {
  productId: string;
  requestedQuantity: number;
  availableStock: number;
};

export async function placeOrder(
  unsafeData: z.infer<typeof productsSchema>
): Promise<
  | {
      error: false;
      message: string;
      orderId: string; // Helpful to return the ID on success
    }
  | {
      error: true;
      message: string;
      reason?:
        | "OUT_OF_STOCK"
        | "AUTH_ERROR"
        | "VALIDATION_ERROR"
        | "INTERNAL_ERROR";
      unavailableItems?: StockErrorItem[];
    }
> {
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return { error: true, message: "Not Authenticated", reason: "AUTH_ERROR" };
  }

  const { success, data } = productsSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Invalid data provided",
      reason: "VALIDATION_ERROR",
    };
  }

  const { addressId, paymentType, cart } = data;
  const productIds = cart.map((item) => item.productId);

  if (productIds.length === 0) {
    return { error: true, message: "Cart is empty" };
  }

  try {
    const result = await db.transaction(async (tx) => {
      const dbProducts = await tx
        .select({
          id: ProductTable.id,
          price: ProductTable.price,
          totalStock: ProductTable.totalStock,
          totalSales: ProductTable.totalSales,
          name: ProductTable.name,
        })
        .from(ProductTable)
        .where(inArray(ProductTable.id, productIds))
        .for("update");

      const orderItemsToInsert = [];
      const unavailableItems: StockErrorItem[] = [];
      let orderTotal = 0;

      for (const cartItem of cart) {
        const product = dbProducts.find((p) => p.id === cartItem.productId);

        if (!product) {
          unavailableItems.push({
            productId: cartItem.productId,
            requestedQuantity: cartItem.quantity,
            availableStock: 0,
          });
          continue;
        }

        const requestedQty = Number(cartItem.quantity);
        const availableStock = product.totalStock-product.totalSales;

        if (availableStock < requestedQty) {
          unavailableItems.push({
            productId: product.id,
            requestedQuantity: requestedQty,
            availableStock: availableStock,
          });
        } else {
          const unitPrice = Number(product.price);
          const subTotal = unitPrice * requestedQty;
          orderTotal += subTotal;

          orderItemsToInsert.push({
            productId: product.id,
            quantity: requestedQty,
            unitPrice: unitPrice,
            subTotal: subTotal,
          });
        }
      }

      if (unavailableItems.length > 0) {
        return {
          error: true,
          reason: "OUT_OF_STOCK",
          message: "Some items in your cart are unavailable.",
          unavailableItems: unavailableItems,
        } as const;
      }

      // 1. Decrement Stock for each product
      for (const item of orderItemsToInsert) {
        await tx
          .update(ProductTable)
          .set({
            totalSales: sql`${ProductTable.totalSales} + ${item.quantity}`,
          })
          .where(eq(ProductTable.id, item.productId));
      }

      // 2. Create Order
      const [newOrder] = await tx
        .insert(OrderTable)
        .values({
          userId,
          addressId,
          payment: paymentType,
          totalAmount: orderTotal.toFixed(2),
        })
        .returning({ id: OrderTable.id });

      // 3. Create Order Items
      await tx.insert(OrderItemTable).values(
        orderItemsToInsert.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toFixed(2),
          subTotal: item.subTotal.toFixed(2),
        }))
      );

      // 4. Set Initial Status
      await tx.insert(OrderStatusTable).values({
        orderId: newOrder.id,
        status: "packed",
      });

      return {
        error: false,
        message: "Order placed successfully",
        orderId: newOrder.id,
      } as const;
    });
    if (result.error === false) {
      // Notify the drivers that a new order is available
      eventBus.emit("dashboard:available:update", {
        type: "ORDER_PLACED",
        orderId: result.orderId,
        timestamp: new Date().toISOString(),
      });
    }

    return result;
  } catch (error: any) {
    console.error("Transaction failed:", error.message);
    return {
      error: true,
      message: error.message || "Failed to place order due to stock issues.",
    };
  }
}
