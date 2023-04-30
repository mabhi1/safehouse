"use client";
import { useRouter } from "next/navigation";

type Props = {};
const CalendarSearch = (props: Props) => {
  const router = useRouter();
  router.push("/calendar");
  return <div></div>;
};
export default CalendarSearch;
