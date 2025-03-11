import { redirect } from "next/navigation";

export default function BillGroupPage({ params }: { params: { id: string } }) {
  // Redirect to the expenses sub-route by default
  redirect(`/split-bill/${params.id}/expenses`);
}
