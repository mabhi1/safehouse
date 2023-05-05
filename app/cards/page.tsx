"use client";
import useAuth from "@/components/auth/AuthProvider";
import { CardType } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Loading from "../loading";
import IndividualCards from "@/components/bank/IndividualCards";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Props = {};
const Cards = (props: Props) => {
  const auth = useAuth();
  const [cards, setCards] = useState<CardType[]>([]);

  const cardsQuery = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/cards?uid=${auth?.currentUser?.uid}`);
      setCards(data.cards);
      return data;
    },
  });

  const showCards = () => {
    if (cards.length === 0) return <div>No Cards to display</div>;
    return cards.map((card: CardType) => {
      return <IndividualCards card={card} key={card.id} searchTerm={""} setCards={setCards} />;
    });
  };

  if (cardsQuery.isLoading) return <Loading />;
  if (cardsQuery.isError) throw cardsQuery.error;

  return (
    <>
      <div className="flex md:hidden items-center justify-between mb-3">
        <div>Cards</div>
        <Link href={"/cards/create"}>
          <Button variant={"outline"}>Add Card</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">{showCards()}</div>
    </>
  );
};
export default Cards;
