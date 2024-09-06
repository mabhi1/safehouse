import { EventType } from "@/lib/db-types";
import resend from "@/resend";
import { EventAlertEmail } from "@/resend/email-templates/event-alert-email";

export async function sendMessageEmail(event: EventType, email: string) {
  const { data, error } = await resend.emails.send({
    from: "Safehouse@resend.dev",
    to: email,
    subject: "Safehouse Reminder",
    react: EventAlertEmail({ event: event }),
  });

  return { data, error };
}
