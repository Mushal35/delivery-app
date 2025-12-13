"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import MultiStepForm from "@/components/form/MultiStep";
import { combinedSchema, stepFields } from "@/features/sign-up/actions/schemas";
import { signupHandler } from "@/features/sign-up/actions/actions";
import { toast } from "sonner";
import z from "zod";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const handleSubmit = async (e: z.infer<typeof combinedSchema>) => {
    // --- STEP 1: CREATE DATABASE RECORD ---
    const res = await signupHandler(e);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      await signIn("credentials", {
        email: e.email,
        password: e.password,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f0f5ff]">
      <div className="background h-[250] bg-cover lg:hidden flex flex-row bg-[url('/bg-sidebar-mobile.svg')] sm:w-full sm:absolute sm:top-0 md:w-full md:absolute md:top-0 md:left-0 md:right-0"></div>
      <MultiStepForm
        sideData={["Personal Info"]}
        defaultValues={{
          email: "",
          name: "",
          password: "",
        }}
        onSubmit={handleSubmit}
        combinedSchema={combinedSchema}
        stepFields={stepFields}
        initial={
          <Link
            href="/sign-in"
            className="text-sm mt-4 text-center text-gray-500 hover:underline"
          >
            Existing User?{" "}
          </Link>
        }
      >
        <NewComponent />
      </MultiStepForm>
    </div>
  );
}

const NewComponent = () => {
  const { control } = useFormContext();
  return (
    <div className="w-[400px]">
      <h1 className="text-3xl text-[#02295a] font-bold mb-2">Personal info</h1>
      <p className="text-[16px] text-[#9699ab]">
        Please provide your name, email address, and phone number.
      </p>
      <div className="mt-7 space-y-4">
        <FormField
          name="name"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs/[1.2]" />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs/[1.2]" />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs/[1.2]" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
