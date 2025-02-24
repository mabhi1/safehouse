"use client";

import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Gem,
  Gift,
  IdCard,
  Landmark,
  Receipt,
  SmartphoneNfc,
  Store,
  WalletCards,
  Banknote,
  Loader,
} from "lucide-react";
import { ExpenseCategoryType } from "@/lib/db-types";

interface PaymentMethodListProps {
  paymentMethods: ExpenseCategoryType[];
}

const icons: Record<string, React.ElementType> = {
  Cash: Banknote,
  "Debit Card": CreditCard,
  "Credit Card": WalletCards,
  "Bank Transfer": Landmark,
  "Mobile Payment": SmartphoneNfc,
  PayPal: IdCard,
  Cryptocurrency: Gem,
  Check: Receipt,
  "Store Credit": Store,
  "Gift Cards": Gift,
};

export default function PaymentMethodList({ paymentMethods }: PaymentMethodListProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center mr-auto gap-1">
          <span className="text-xl capitalize">Payments</span>
          <Badge variant="secondary" className="font-normal">
            {paymentMethods.length}
          </Badge>
        </div>
      </div>
      {paymentMethods.length === 0 ? (
        <div>No category found.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {paymentMethods.map(({ id, name, expenses }) => {
            const Icon = icons[name] ?? Loader;
            return (
              <li key={id} className="flex items-center gap-2 border rounded p-5">
                <Icon className="w-4 h-4" />
                <div>{name}</div>
                {expenses?.length > 0 && (
                  <div className="bg-primary text-muted ml-auto px-2 rounded-full">{expenses.length}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
