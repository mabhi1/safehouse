"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

type Props = {};
const MobileSearchForm = (props: Props) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = document.getElementById("mobilePage") as HTMLSelectElement;
    router.push(`/search/${page.value}/${search.trim().toLowerCase()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="mobileSearchForm"
      className="flex md:hidden gap-2 w-full -mt-20 mb-[0.7rem] transition-all duration-300 bg-slate-50 justify-center py-3 border-b"
    >
      <div className="relative">
        <Input
          type="text"
          id="searchPage"
          placeholder="Search"
          wide={"lg"}
          className="pr-[6.5rem]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select name="page" id="mobilePage" className="absolute top-1 bottom-1 right-1 focus:outline-none bg-transparent border-l-2 border-slate-400">
          <option value="notes">Notes</option>
          <option value="calendar">Calendar</option>
          <option value="cards">Cards</option>
          <option value="passwords">Passwords</option>
        </select>
      </div>
      <Button>Search</Button>
    </form>
  );
};
export default MobileSearchForm;
