"use client";
import { dosignOut } from "@/firebase/firebaseFunctions";
import useAuth from "./AuthProvider";
import Button from "./ui/Button";

type Props = {};

const LogoutBtn = (props: Props) => {
  const setVerified = useAuth();
  const handleLogout = async () => {
    try {
      await dosignOut();
      setVerified(false);
    } catch (error) {
      console.log(error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};
export default LogoutBtn;
