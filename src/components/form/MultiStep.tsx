"use client";

import React, { ReactNode, useState } from "react";
import { useForm, SubmitHandler, Path, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import StepSidebar from "./StepSidebar";

type MultiStepFormProps<
  Shape extends z.ZodRawShape,
  Schema extends z.ZodObject<Shape>
> = {
  children: ReactNode;
  combinedSchema: Schema;
  defaultValues: DefaultValues<z.input<Schema>>;
  stepFields: Path<z.input<Schema>>[][];
  onSubmit: SubmitHandler<z.output<Schema>>;
  sideData: string[];
  initial?: ReactNode;
};

const MultiStepForm = <
  Shape extends z.ZodRawShape,
  Schema extends z.ZodObject<any>
>({
  children,
  combinedSchema,
  defaultValues,
  stepFields,
  onSubmit,
  sideData,
  initial,
}: MultiStepFormProps<Shape, Schema>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = React.Children.toArray(children);

  const form = useForm<z.input<Schema>, any, z.output<Schema>>({
    resolver: zodResolver(combinedSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleNext = async () => {
    if (currentStep >= steps.length - 1) return;

    const fields = stepFields[currentStep];
    const isValid = await form.trigger(fields, { shouldFocus: true });

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="main-box w-fit sm:relative sm:flex-col md:relative h-fit rounded-2xl flex md:flex-col lg:flex-row bg-[#ffffff] p-3">
      <StepSidebar currentStep={currentStep} sideData={sideData} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:p-5 sm:pt-0  md:p-5 md:pt-0 lg:p-12 lg:pb-0 lg:pr-19 justify-between"
        >
          {steps[currentStep]}

          <div className="flex justify-between mb-5">
            {currentStep > 0 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              initial
            )}

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Submit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MultiStepForm;
