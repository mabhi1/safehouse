"use client";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useRouter } from "next/navigation";

type Props = {};
const SearchBar = (props: Props) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = document.getElementById("page") as HTMLSelectElement;
    router.push(`/search/${page.value}/${search.trim().toLowerCase()}`);
  };

  return (
    <form className="hidden md:flex gap-2" onSubmit={handleSubmit}>
      <div className="relative">
        <Input type="text" placeholder="Search" wide={"lg"} className="pr-[6.5rem]" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select name="page" id="page" className="absolute top-1 bottom-1 right-1 focus:outline-none bg-transparent border-l-2 border-slate-400">
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
export default SearchBar;
