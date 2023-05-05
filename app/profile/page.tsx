"use client";
import useAuth from "@/components/auth/AuthProvider";
import ChangeName from "@/components/auth/ChangeName";
import ChangePassword from "@/components/auth/ChangePassword";
import ChangeProfile from "@/components/auth/ChangeProfile";
import Button from "@/components/ui/Button";
import { dosignOut } from "@/firebase/firebaseFunctions";
import Image from "next/image";

type Props = {};
const Profile = (props: Props) => {
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await dosignOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 md:gap-5">
      <div className="flex justify-between items-start">
        {auth?.currentUser?.photoURL ? (
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
            <Image src={auth?.currentUser.photoURL} width={100} height={100} alt={auth?.currentUser?.email || ""} priority />
          </div>
        ) : (
          <Image src="/profile.png" width={100} height={100} alt={auth?.currentUser?.email || ""} priority />
        )}
        <Button variant={"destructive"} onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <div>Name : {auth?.currentUser?.displayName}</div>
        <div>Email : {auth?.currentUser?.email}</div>
      </div>
      <ChangeName user={auth!.currentUser} setUser={auth!.setCurrentUser} />
      <ChangeProfile user={auth!.currentUser} setUser={auth!.setCurrentUser} />
      <ChangePassword user={auth!.currentUser} />
    </div>
  );
};
export default Profile;
