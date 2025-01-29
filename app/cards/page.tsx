import CardsCard from "@/components/pages/cards/cards-card";
import CreateCardForm from "@/components/pages/cards/create-card-form";
import SortCards from "@/components/pages/cards/sort-cards";
import { Badge } from "@/components/ui/badge";
import { CardsSortValues, getSortKey, isMatching } from "@/lib/utils";
import { GetCardsByUser } from "@/prisma/db/cards";
import { getEncryptionByUser } from "@/prisma/db/encryption";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function Cards({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const searchText = searchParams["search"];

  const { data: encryptionData, error: encryptionError } = await getEncryptionByUser(userId);
  if (!encryptionData || encryptionError) throw new Error("");

  const { data, error } = await GetCardsByUser(userId, getSortKey("cards", searchParams["sort"] as CardsSortValues));
  if (!data || error) throw new Error("User not found");

  function getFilteredList() {
    if (searchText && searchText.trim().length) return data!.filter((card) => isMatching(card.bank, searchText));
    else return data;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-base uppercase">Cards</span>
          <Badge variant="secondary" className="font-normal">
            {data.length}
          </Badge>
        </div>
        <SortCards isSearching={!!searchText?.trim().length} />
        <CreateCardForm uid={userId} salt={encryptionData.salt} hash={encryptionData.hash} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data.length <= 0 && <div className="text-lg">No Saved Cards</div>}
        {getFilteredList()!.map((card) => (
          <CardsCard
            key={card.id}
            card={card}
            uid={userId}
            searchTerm={searchText}
            salt={encryptionData.salt}
            hash={encryptionData.hash}
          />
        ))}
      </ul>
    </div>
  );
}
