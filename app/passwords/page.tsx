"use client";
import Input from "@/components/ui/Input";
import { BiSearchAlt2 } from "react-icons/bi";
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
  const currentUser = useAuth();
  const [passwords, setPasswords] = useState<PasswordType[]>([]);
  const [term, setTerm] = useState("");
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordType[]>([]);

  const passwordsQuery = useQuery({
    queryKey: ["passwords"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/passwords?uid=${currentUser?.uid}`);
      setPasswords(data.passwords);
      return data;
    },
  });

  const filterPasswords = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim().toLowerCase();
    setTerm(text);
    setFilteredPasswords(
      passwords.filter((pass: PasswordType) => {
        if (pass.site.toLowerCase().includes(text) || pass.username.toLowerCase().includes(text) || pass.password.toLowerCase().includes(text))
          return pass;
      })
    );
  };

  const showPasswords = (passList: PasswordType[]) => {
    if (passList.length === 0) return <div>No Notes to display</div>;
    return passList.map((pass: PasswordType) => {
      return <IndividualPassword password={pass} key={pass.id} searchTerm={term} setPasswords={setPasswords} />;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {term ? showPasswords(filteredPasswords) : showPasswords(passwords)}
      </div>
    </>
  );
};
export default Passwords;
