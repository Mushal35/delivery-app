"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import MultiStepForm from "@/components/form/MultiStep";
import {
  combinedSchema,
  stepFields,
} from "@/features/enrollment/actions/schemas";
import { registerPartner } from "@/features/enrollment/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import z from "zod";
import { mutate } from "swr";

const Page = () => {
  const router = useRouter();
  const handleEnrollment = async (e: z.infer<typeof combinedSchema>) => {
    const res = await registerPartner(e);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      mutate("/api/auth/roles");
      router.replace("/partner/home");
    }
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f0f5ff]">
      <div className="background h-[250] bg-cover lg:hidden flex flex-row bg-[url('/bg-sidebar-mobile.svg')] sm:w-full sm:absolute sm:top-0 md:w-full md:absolute md:top-0 md:left-0 md:right-0"></div>
      <MultiStepForm
        sideData={["Personal Info"]}
        defaultValues={{
          addressLine: "",
          pincode: "",
        }}
        onSubmit={handleEnrollment}
        combinedSchema={combinedSchema}
        stepFields={stepFields}
      >
        <FormComponent />
      </MultiStepForm>
    </div>
  );
};

export default Page;

const FormComponent = () => {
  const { control } = useFormContext();
  return (
    <div className="w-[400px]">
      <h1 className="text-3xl text-[#02295a] font-bold mb-2">Personal info</h1>
      <p className="text-[16px] text-[#9699ab]">
        Please provide your residential address.
      </p>
      <div className="mt-7 space-y-4">
        <FormField
          name="addressLine"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs/[1.2]" />
            </FormItem>
          )}
        />
        <FormField
          name="pincode"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
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
