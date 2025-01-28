import { useState, useTransition, FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormSubmitOptions<T extends Record<string, string | Date>> = {
  initialValues: T;
  onSubmit: (values: T) => Promise<{ data: any; error: any }>;
  onSuccess?: () => void;
  onFailure?: () => void;
  successMessage?: string;
  failureMessage?: string;
  successRedirectUrl?: string;
  resetOnSuccess?: boolean;
};

export const useFormSubmit = <T extends Record<string, string | Date>>({
  initialValues,
  onSubmit,
  onSuccess,
  onFailure,
  successRedirectUrl,
  successMessage = "Action completed successfully",
  failureMessage = "Unable to complete the action",
  resetOnSuccess = true,
}: FormSubmitOptions<T>) => {
  const [formValues, setFormValues] = useState<T>(initialValues);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { id: string; value: string | Date } }
  ) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      Object.values(formValues).some((value) => typeof value === "string" && !value.trim()) ||
      Object.keys(formValues).every((key) => formValues[key] === initialValues[key])
    )
      return;

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
        toast.error("Error getting master password");
        onFailure && onFailure();
      }
    });
  };

  return { formValues, handleInputChange, handleSubmit, isPending };
};
