"use client";
import { useRouter } from "next/navigation";

type Props = {};
const NotesSearch = (props: Props) => {
  const router = useRouter();
  router.push("/notes");
  return <div></div>;
};
export default NotesSearch;
