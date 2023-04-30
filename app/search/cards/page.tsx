"use client";
import { useRouter } from "next/navigation";

type Props = {};
const CardSearch = (props: Props) => {
  const router = useRouter();
  router.push("/cards");
  return <div></div>;
};
export default CardSearch;
