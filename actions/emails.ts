"use server";

import { EventType } from "@/lib/db-types";
import resend from "@/resend";
import { ContactUsEmail } from "@/resend/email-templates/contact-us-email";
import { EventAlertEmail } from "@/resend/email-templates/event-alert-email";

export async function sendAlertMessageEmail(event: EventType, email: string) {
  const { data, error } = await resend.emails.send({
    from: "Safehouse@resend.dev",
    to: email,
    subject: "Safehouse Reminder",
    react: EventAlertEmail({ event: event }),
  });

  return { data, error };
}

export async function contactUsMessageEmail(message: string, senderEmail: string, senderName: string) {
  const { data, error } = await resend.emails.send({
    from: "Safehouse@resend.dev",
    replyTo: senderEmail,
    to: process.env.ADMIN_EMAIL!,
    subject: "Safehouse Enquiry",
    react: ContactUsEmail({ message, senderEmail, senderName }),
  });

  return { data, error };
}
