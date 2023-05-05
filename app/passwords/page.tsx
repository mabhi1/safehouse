"use client";
import useAuth from "@/components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../loading";
import { PasswordType } from "@/lib/types/dbTypes";
import IndividualPassword from "@/components/passwords/IndividualPassword";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Props = {};
const Passwords = (props: Props) => {
  const auth = useAuth();
  const [passwords, setPasswords] = useState<PasswordType[]>([]);

  const passwordsQuery = useQuery({
    queryKey: ["passwords"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/passwords?uid=${auth?.currentUser?.uid}`);
      setPasswords(data.passwords);
      return data;
    },
  });

  const showPasswords = (passList: PasswordType[]) => {
    if (passList.length === 0) return <div>No Passwords to display</div>;
    return passList.map((pass: PasswordType) => {
      return <IndividualPassword password={pass} key={pass.id} searchTerm={""} setPasswords={setPasswords} />;
    });
  };

  if (passwordsQuery.isLoading) return <Loading />;
  if (passwordsQuery.isError) throw passwordsQuery.error;

  return (
    <>
      <div className="flex md:hidden items-center justify-between mb-3">
        <div>Passwords</div>
        <Link href={"/passwords/create"}>
          <Button variant={"outline"}>Add Password</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">{showPasswords(passwords)}</div>
    </>
  );
};
export default Passwords;
