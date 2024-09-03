import CardsCard from "@/components/pages/cards/cards-card";
import CreateCardForm from "@/components/pages/cards/create-card-form";
import { Badge } from "@/components/ui/badge";
import { CardsSortValues, getSortKey } from "@/lib/utils";
import { GetCardsByUser } from "@/prisma/db/cards";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function Cards({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized Access");

  const { data, error } = await GetCardsByUser(userId, getSortKey("cards", searchParams["sort"] as CardsSortValues));
  if (!data || error) throw new Error("User not found");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <span className="text-base uppercase mr-auto">
          Cards
          <Badge variant="secondary" className="font-normal ml-1">
            {data.length}
          </Badge>
        </span>
        <CreateCardForm uid={userId} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {data.length <= 0 && <div className="text-lg">No Saved Cards</div>}
        {data.map((card) => (
          <CardsCard key={card.id} card={card} uid={userId} />
        ))}
      </ul>
    </div>
  );
}
