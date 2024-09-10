import { EventType } from "@/lib/db-types";
import { dateFormatter } from "@/lib/utils";

interface EventAlertEmailProps {
  event: EventType;
}

export const EventAlertEmail: React.FC<Readonly<EventAlertEmailProps>> = ({ event }) => {
  return (
    <div>
      <div>Hello,</div>
      <p style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>
        This is a reminder about an upcoming event on {dateFormatter(event.date)}.
      </p>
      <p>
        <div>Title: {event.title}</div>
        <div>Description: {event.description}</div>
      </p>
      <div>Thanks&#44;</div>
      <div>Safehouse team</div>
    </div>
  );
};
