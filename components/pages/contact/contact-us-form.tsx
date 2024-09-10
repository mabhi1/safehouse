"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizonal } from "lucide-react";
import { contactUsMessageEmail } from "@/actions/emails";
import { useFormSubmit } from "@/hooks/useFormSubmit";

type ContactUsFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export default function ContactUsForm() {
  const initialFormValues: ContactUsFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  };

  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (values: ContactUsFormValues) => {
    if (!executeRecaptcha) throw new Error();
    const gReCaptchaToken = await executeRecaptcha("enquiryFormSubmit");
    try {
      const api = await fetch("/api/captcha", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gRecaptchaToken: gReCaptchaToken,
        }),
      });
      const response = await api.json();
      if (!response?.success) throw new Error();
      return await contactUsMessageEmail(
        values.message.trim(),
        values.email.trim(),
        `${values.firstName.trim()} ${values.lastName.trim()}`
      );
    } catch (error) {
      return { data: null, error: true };
    }
  };

  const { formValues, handleInputChange, handleSubmit, isPending } = useFormSubmit<ContactUsFormValues>({
    initialValues: initialFormValues,
    onSubmit: onSubmit,
  });

  return (
    <form className="space-y-5 w-full lg:w-3/5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">
            First Name<span className="text-destructive">*</span>
          </Label>
          <Input
            name="firstName"
            id="firstName"
            type="text"
            autoFocus={true}
            required
            placeholder="Enter First Name"
            value={formValues.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">
            Last Name<span className="text-destructive">*</span>
          </Label>
          <Input
            name="lastName"
            id="lastName"
            type="text"
            placeholder="Enter Last Name"
            required
            value={formValues.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">
          Email<span className="text-destructive">*</span>
        </Label>
        <Input
          name="email"
          id="email"
          type="email"
          placeholder="Enter Email"
          required
          value={formValues.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">
          Message<span className="text-destructive">*</span>
        </Label>
        <Textarea
          name="message"
          id="message"
          placeholder="Enter message"
          rows={7}
          cols={45}
          required
          value={formValues.message}
          onChange={handleInputChange}
        />
      </div>

      <Button disabled={isPending} className="group">
        {isPending ? (
          <>
            Please wait
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Send Message
            <SendHorizonal className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </>
        )}
      </Button>
    </form>
  );
}
