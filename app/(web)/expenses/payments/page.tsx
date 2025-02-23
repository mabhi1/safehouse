import PaymentMethodList from "@/components/pages/expenses/payment/payment-method-list";
import { getAllPaymentTypes } from "@/prisma/db/expenses";
import { auth } from "@clerk/nextjs/server";

export default async function PaymentsMethodPage() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) redirectToSignIn();

  const { data, error } = await getAllPaymentTypes(userId!);
  if (!data || error) throw new Error("Error fetching payment methods");

  return <PaymentMethodList paymentMethods={data} />;
}
