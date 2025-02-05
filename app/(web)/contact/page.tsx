import ContactUsForm from "@/components/pages/contact/contact-us-form";
import RecaptchaProvider from "@/components/providers/recaptcha-provider";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-10">
      <div className="space-y-10 flex-1">
        <div>
          <div className="text-base uppercase">Get in touch</div>
          <div className="text-muted-foreground">
            Need to get in touch with us? Send us an email to{" "}
            <span className="text-primary">mabhishek0221@gmail.com</span> or fill out the form below with your enquiry.
          </div>
        </div>
        <RecaptchaProvider>
          <ContactUsForm />
        </RecaptchaProvider>
      </div>
      <Image src="/contact-us.svg" width={300} height={300} alt="Contact Us" priority className="w-60 lg:w-96" />
    </div>
  );
}
