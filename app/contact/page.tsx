import ContactUsForm from "@/components/pages/contact/contact-us-form";
import RecaptchaProvider from "@/components/providers/recaptcha-provider";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="flex items-start justify-between gap-10">
      <div className="space-y-5 flex-1">
        <div className="text-base uppercase">Get in touch</div>
        <div>Need to get in touch with us? Fill out the form with your enquiry.</div>
        <RecaptchaProvider>
          <ContactUsForm />
        </RecaptchaProvider>
      </div>
      <Image src="/contact-us.svg" width={300} height={300} alt="Contact Us" priority className="hidden md:block" />
    </div>
  );
}
