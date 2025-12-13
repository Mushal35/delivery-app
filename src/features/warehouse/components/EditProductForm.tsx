"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { productFormSchema } from "../actions/schema";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 1. Zod Schema Updated

type ProductFormValues = z.infer<typeof productFormSchema>;

// Define Types based on your Drizzle Schema
interface Category {
  id: string;
  title: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // Drizzle decimal returns string
  totalStock: number;
  totalSales: number;
  imageUrl: string;
  categoryId: string;
}

interface EditProductPageProps {
  product?: Product;
  categories: Category[];
}

export default function EditProductPage({
  product,
  categories,
}: EditProductPageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // 2. Initialize form with prop data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ?? {
      name: "",
      description: "",
      price: "0",
      totalStock: 0,
      imageUrl: "",
      categoryId: "",
    },
  });

  const currentStock = form.watch("totalStock") || 0;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadProductImage(formData);
      if (res.error) {
        toast.error(res.message);
      } else {
        form.setValue("imageUrl", res.filePath, { shouldValidate: true });
        toast.success(res.message);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(data: ProductFormValues) {
    const action = product?.id
      ? updateProduct.bind(null, product.id)
      : createProduct;
    const res = await action(data);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      router.refresh();
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 overflow-auto flex-1">
      <div className="flex items-center gap-4">
        <Link href="/admin/warehouse">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-rose-950">
            Edit Product
          </h1>
          <p className="text-muted-foreground">
            Update product details and inventory.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          className="bg-rose-600 hover:bg-rose-700"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Water Bottle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 3. Category Select Field */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Product description..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory & Pricing</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Stock Count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Media */}
            <div className="space-y-8">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative group">
                    <div className="aspect-square relative rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 overflow-hidden">
                      {/* Image Preview */}
                      {form.watch("imageUrl") ? (
                        <img
                          src={form.watch("imageUrl")}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground p-4">
                          {isUploading ? (
                            <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                          ) : (
                            <Upload className="h-8 w-8 mx-auto mb-2" />
                          )}
                          <span className="text-xs">
                            {isUploading
                              ? "Uploading..."
                              : "Click to upload image"}
                          </span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Path</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                            placeholder="Upload an image to generate path"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Availability</div>
                      <div
                        className={`text-xs ${
                          currentStock - (product?.totalSales || 0) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {currentStock - (product?.totalSales || 0) > 0
                          ? `${
                              currentStock - (product?.totalSales || 0)
                            } Available`
                          : "Out of Stock"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
