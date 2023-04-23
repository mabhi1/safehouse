"use client";
import { dosignOut } from "@/firebase/firebaseFunctions";
import Button from "../ui/Button";

type Props = {};

const LogoutBtn = (props: Props) => {
  const handleLogout = async () => {
    try {
      await dosignOut();
    } catch (error) {
      console.log(error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};
export default LogoutBtn;
