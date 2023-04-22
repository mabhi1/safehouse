"use client";
import { dosignOut } from "@/firebase/firebaseFunctions";
import useAuth from "./AuthProvider";

type Props = {};

const LogoutBtn = (props: Props) => {
  const setVerified = useAuth();
  const handleLogout = async () => {
    console.log("asd");
    try {
      await dosignOut();
      setVerified(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="py-1 px-2 text-slate-50 bg-cyan-900 rounded cursor-pointer" onClick={handleLogout}>
      Logout
    </button>
  );
};
export default LogoutBtn;
