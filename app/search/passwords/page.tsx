"use client";
import { useRouter } from "next/navigation";

type Props = {};
const PasswordSearch = (props: Props) => {
  const router = useRouter();
  router.push("/passwords");
  return <div></div>;
};
export default PasswordSearch;
