"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
// You might need a separate schema for login (just email/password)
import MultiStepForm from "@/components/form/MultiStep";
import { combinedSchema, stepFields } from "@/features/sign-in/actions/schemas";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const { status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get("error");
    const callBack = searchParams.get("callbackUrl");
    if (urlError) {
      if (urlError === "CredentialsSignin") {
        setError("Invalid email or password");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
    if (callBack) {
      setCallbackUrl(callBack);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: any) => {
    setError("");
    await signIn("credentials", {
      email: e.email,
      password: e.password,
      callbackUrl,
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f0f5ff]">
      <div className="background h-[250] bg-cover lg:hidden flex flex-row bg-[url('/bg-sidebar-mobile.svg')] sm:w-full sm:absolute sm:top-0 md:w-full md:absolute md:top-0 md:left-0 md:right-0"></div>

      {/* Note: If MultiStepForm forces a sidebar, you might want 
         to wrap this in a simple Card component instead for Login. 
         But sticking to your pattern:
      */}
      <MultiStepForm
        sideData={["Login"]}
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSubmit}
        combinedSchema={combinedSchema} // Ensure this schema makes 'name' optional or create a loginSchema
        stepFields={stepFields}
        initial={
          <Link
            href={
              callbackUrl
                ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/sign-up"
            }
            replace
            className="text-sm mt-4 text-center text-gray-500 hover:underline"
          >
            Don't have an account?{" "}
          </Link>
        }
      >
        <LoginFields error={error} />
      </MultiStepForm>
    </div>
  );
}

const LoginFields = ({ error }: { error?: string }) => {
  const { control } = useFormContext();
  return (
    <div className="w-[400px]">
      <h1 className="text-3xl text-[#02295a] font-bold mb-2">Welcome Back</h1>
      <p className="text-[16px] text-[#9699ab]">
        Please enter your credentials to access your account.
      </p>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="mt-7 space-y-4">
        {/* Name field removed for Login */}

        <FormField
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
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
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage className="text-xs/[1.2]" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
