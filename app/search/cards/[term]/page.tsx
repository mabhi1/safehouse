"use client";

import Loading from "@/app/loading";
import useAuth from "@/components/auth/AuthProvider";
import IndividualCards from "@/components/bank/IndividualCards";
import { CardType } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Props = {
  params: { term: string };
};
const CardTerm = ({ params: { term } }: Props) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const currentUser = useAuth();

  const cardsQuery = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/cards?uid=${currentUser?.uid}`);
      setCards(data.cards.filter((card: CardType) => card.bank.toLowerCase().includes(term) || card.type.toLowerCase().includes(term)));
      return data;
    },
  });

  if (cardsQuery.isLoading) return <Loading />;
  if (cardsQuery.isError) throw cardsQuery.error;

  const showCards = () => {
    if (cards.length === 0) return <div>No Cards to display</div>;
    return cards.map((card: CardType) => {
      return <IndividualCards card={card} key={card.id} searchTerm={term} setCards={setCards} />;
    });
  };

  if (!cardsQuery.isLoading) return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">{showCards()}</div>;
};
export default CardTerm;
