import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define Prisma schema
export const models = {
  expense: prisma.expense,
  category: prisma.category,
  paymentType: prisma.paymentType,
  currency: prisma.currency,
};

// Seeding function
async function seed() {
  await prisma.category.createMany({
    data: [
      { name: "Food & Dining" },
      { name: "Transportation" },
      { name: "Housing" },
      { name: "Entertainment" },
      { name: "Shopping" },
      { name: "Health & Fitness" },
      { name: "Subscriptions & Memberships" },
      { name: "Travel" },
      { name: "Education" },
      { name: "Miscellaneous" },
    ],
  });

  await prisma.paymentType.createMany({
    data: [
      { name: "Cash" },
      { name: "Debit Card" },
      { name: "Credit Card" },
      { name: "Bank Transfer" },
      { name: "Mobile Payment" },
      { name: "PayPal" },
      { name: "Cryptocurrency" },
      { name: "Check" },
      { name: "Store Credit" },
      { name: "Gift Cards" },
    ],
  });

  await prisma.currency.createMany({
    data: [
      { code: "USD", name: "United States Dollar", symbol: "$" },
      { code: "EUR", name: "Euro", symbol: "€" },
      { code: "GBP", name: "British Pound Sterling", symbol: "£" },
      { code: "INR", name: "Indian Rupee", symbol: "₹" },
      { code: "JPY", name: "Japanese Yen", symbol: "¥" },
      { code: "CAD", name: "Canadian Dollar", symbol: "$" },
      { code: "AUD", name: "Australian Dollar", symbol: "$" },
      { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
      { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
      { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    ],
  });

  console.log("Seeding completed.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default prisma;
