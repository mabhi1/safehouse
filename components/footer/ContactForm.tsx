"use client";
import Button from "../ui/Button";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { showToast } from "@/utils/handleToast";
import useAuth from "../auth/AuthProvider";
import Spinner from "../ui/Spinner";

type Props = {};
const ContactForm = (props: Props) => {
  const auth = useAuth();
  const formElement = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    console.log(message);
    if (message.trim() === "") {
      showToast("error", "Invalid Message");
      return;
    }
    setLoading(true);
    if (formElement.current)
      emailjs
        .sendForm(
          `${process.env.NEXT_PUBLIC_SERVICE_ID}`,
          `${process.env.NEXT_PUBLIC_TEMPLATE_ID}`,
          formElement.current,
          `${process.env.NEXT_PUBLIC_PUBLIC_ID}`
        )
        .then(
          (result) => {
            showToast("success", "Message sent successfully");
            setMessage("");
            setLoading(false);
          },
          (error) => {
            setMessage("");
            setLoading(false);
            showToast("error", "Error sending message");
          }
        );
  };
  return (
    <div className="flex flex-col md:gap-2 lg:px-10 pt-1 lg:pt-0">
      <div className="text-slate-50">Contact Us</div>
      <form ref={formElement} className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input type="hidden" name="email" id="email" value={auth?.currentUser?.email || ""} />
        <textarea
          name="message"
          id="message"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none border-2 focus-visible:outline-none bg-slate-50 text-slate-900 border-slate-400 rounded p-2 focus:border-cyan-900 w-full"
          rows={3}
        ></textarea>
        {loading ? (
          <Button variant={"disabled"} disabled>
            <Spinner size="sm" />
          </Button>
        ) : (
          <Button className="bg-cyan-50 hover:bg-cyan-100 focus:bg-cyan-100 text-cyan-950">Send</Button>
        )}
      </form>
    </div>
  );
};
export default ContactForm;
