import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export default resend;
