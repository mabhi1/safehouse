interface ContactUsEmailProps {
  senderName: string;
  senderEmail: string;
  message: string;
}

export const ContactUsEmail = ({ senderEmail, senderName, message }: ContactUsEmailProps) => {
  return (
    <div>
      <div>Hello, Admin!</div>
      <p>
        You got a new safehouse enquiry from{" "}
        <span style={{ color: "rgb(30, 41, 59)", textDecoration: "underline" }}>
          {senderName} ({senderEmail})
        </span>
        . You can reply to this email to send a response to the user.
      </p>
      <p style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>{message}</p>
      <div>Thanks&#44;</div>
      <div>Safehouse team</div>
    </div>
  );
};
