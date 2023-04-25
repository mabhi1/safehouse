"use client";
import useAuth from "@/components/auth/AuthProvider";
import { CardType } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Loading from "../loading";
import IndividualCards from "@/components/bank/IndividualCards";
import { BiSearchAlt2 } from "react-icons/bi";
import Input from "@/components/ui/Input";

type Props = {};
const Cards = (props: Props) => {
  const currentUser = useAuth();
  const [cards, setCards] = useState<CardType[]>([]);
  const [term, setTerm] = useState("");
  const [filtered, setFiltered] = useState<CardType[]>([]);

  const passwordsQuery = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/cards?uid=${currentUser?.uid}`);
      setCards(data.cards);
      return data;
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toLowerCase();
    setTerm(value);
    setFiltered(cards.filter((card) => card.bank.toLowerCase().includes(value) || card.type.toLowerCase().includes(value)));
  };

  const showCards = (cardList: CardType[]) => {
    if (cardList.length === 0) return <div>No Cards to display</div>;
    return cardList.map((card: CardType) => {
      return <IndividualCards card={card} key={card.id} searchTerm={term} />;
    });
  };

  if (passwordsQuery.isLoading) return <Loading />;
  if (passwordsQuery.isError) throw passwordsQuery.error;

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="flex justify-between gap-5 items-center">
        <h1>Cards</h1>
        <span className="relative">
          <Input variant="iconSmall" wide="md" type="text" placeholder="Search" onChange={handleSearch} />
          <BiSearchAlt2 className="text-slate-400 absolute top-1/2 -translate-y-1/2 left-2" />
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">{term ? showCards(filtered) : showCards(cards)}</div>
    </div>
  );
};
export default Cards;
