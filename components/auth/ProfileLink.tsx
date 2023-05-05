"use client";
import useAuth from "./AuthProvider";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const ProfileLink = (props: Props) => {
  const auth = useAuth();
  return (
    <Link href={"/profile"}>
      {auth?.currentUser?.photoURL ? (
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image src={auth?.currentUser.photoURL} width={50} height={50} alt={auth?.currentUser?.email || ""} priority />
        </div>
      ) : (
        <Image src="/profile.png" width={50} height={50} alt={auth?.currentUser?.email || ""} priority />
      )}
    </Link>
  );
};
export default ProfileLink;
