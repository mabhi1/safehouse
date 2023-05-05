"use client";

import Loading from "@/app/loading";
import useAuth from "@/components/auth/AuthProvider";
import IndividualPassword from "@/components/passwords/IndividualPassword";
import { PasswordType } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Props = {
  params: { term: string };
};
const PasswordTerm = ({ params: { term } }: Props) => {
  const [passwords, setPasswords] = useState<PasswordType[]>([]);
  const auth = useAuth();

  const passwordsQuery = useQuery({
    queryKey: ["passwords"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/passwords?uid=${auth?.currentUser?.uid}`);
      setPasswords(
        data.passwords.filter((pass: PasswordType) => {
          if (pass.site.toLowerCase().includes(term) || pass.username.toLowerCase().includes(term)) return pass;
        })
      );
      return data;
    },
  });

  if (passwordsQuery.isLoading) return <Loading />;
  if (passwordsQuery.isError) throw passwordsQuery.error;

  const showPasswords = () => {
    if (passwords.length === 0) return <div>No Notes to display</div>;
    return passwords.map((pass: PasswordType) => {
      return <IndividualPassword password={pass} key={pass.id} searchTerm={term} setPasswords={setPasswords} />;
    });
  };

  if (!passwordsQuery.isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">{showPasswords()}</div>;
};
export default PasswordTerm;
