import { useState, useTransition, FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormSubmitOptions<T extends Record<string, string>> = {
  initialValues: T;
  onSubmit: (values: T) => Promise<{ data: any; error: any }>;
  onSuccess?: () => void;
  onFailure?: () => void;
  successRedirectUrl?: string;
  resetOnSuccess?: boolean;
};

export const useFormSubmit = <T extends Record<string, string>>({
  initialValues,
  onSubmit,
  onSuccess,
  onFailure,
  successRedirectUrl,
  resetOnSuccess = true,
}: FormSubmitOptions<T>) => {
  const [formValues, setFormValues] = useState<T>(initialValues);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      Object.values(formValues).some((value) => !value.trim()) ||
      Object.keys(formValues).every((key) => formValues[key] === initialValues[key])
    )
      return;

    startTransition(async () => {
      const { data, error } = await onSubmit(formValues);
      if (error || !data) {
        if (resetOnSuccess) {
          setFormValues(initialValues);
        }
        onFailure && onFailure();
        toast.error("Unable to complete the action");
      } else {
        onSuccess && onSuccess();
        toast.success("Action completed successfully");
        successRedirectUrl && router.push(successRedirectUrl);
      }
    });
  };

  return { formValues, handleInputChange, handleSubmit, isPending };
};
