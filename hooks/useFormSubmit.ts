import { useState, useTransition, FormEvent, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ValidationFn = (value: string | number | Date | Record<string, any>) => boolean; // Custom validation function

type FormSubmitOptions<T extends Record<string, string | Date | number | Record<string, any>>> = {
  initialValues: T;
  onSubmit: (values: T) => Promise<{ data: any; error: any }>;
  onSuccess?: () => void;
  onFailure?: () => void;
  successMessage?: string;
  failureMessage?: string;
  successRedirectUrl?: string;
  resetOnSuccess?: boolean;
  optionalFields?: (keyof T)[]; // Define optional fields
  validations?: Partial<Record<keyof T, ValidationFn>>; // Custom validations for specific fields
  additionalChanges?: () => boolean;
};

export const useFormSubmit = <T extends Record<string, string | Date | number | Record<string, any>>>({
  initialValues,
  onSubmit,
  onSuccess,
  onFailure,
  successRedirectUrl,
  successMessage = "Action completed successfully",
  failureMessage = "Unable to complete the action",
  resetOnSuccess = true,
  optionalFields = [],
  validations = {},
  additionalChanges = () => true,
}: FormSubmitOptions<T>) => {
  const [formValues, setFormValues] = useState<T>(initialValues);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { id: string; value: string | Date | number | Record<string, any> } }
  ) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  // Compute form validity dynamically
  const isValid = useMemo(() => {
    // Check that all required fields (non-optional) are filled
    const requiredFieldsValid = Object.keys(formValues)
      .filter((key) => !optionalFields.includes(key as keyof T)) // Exclude optional fields
      .every((key) => {
        const value = formValues[key as keyof T];
        return typeof value !== "string" || value.trim(); // Ensure required fields are filled
      });

    // Check if at least one field is different from initialValues
    const hasChanges = Object.keys(formValues).some(
      (key) => formValues[key as keyof T] !== initialValues[key as keyof T]
    );

    // Run custom validation functions for optional fields
    const optionalValid = Object.entries(validations).every(([key, validateFn]) => {
      const value = formValues[key as keyof T];
      return validateFn ? validateFn(value) : true; // Ensure validateFn exists before calling it
    });

    return requiredFieldsValid && (hasChanges || (additionalChanges ? additionalChanges() : true)) && optionalValid;
  }, [formValues, initialValues, optionalFields, validations]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isValid) return; // Prevent submitting invalid form

    startTransition(async () => {
      try {
        const { data, error } = await onSubmit(formValues);
        if (error || !data) {
          onFailure && onFailure();
          toast.error(failureMessage);
        } else {
          onSuccess && onSuccess();
          toast.success(successMessage);
          if (resetOnSuccess) {
            setFormValues(initialValues);
          }
          successRedirectUrl && router.push(successRedirectUrl);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error submitting form");
        onFailure && onFailure();
      }
    });
  };

  return { formValues, handleInputChange, handleSubmit, isPending, isValid };
};
