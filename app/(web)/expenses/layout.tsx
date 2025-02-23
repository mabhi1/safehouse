import { ExpenseMenu } from "@/components/pages/expenses/expense-menu";

export const metadata = {
  title: "Expenses",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-14 md:pt-4">
      <ExpenseMenu />
      <div className="flex-1">{children}</div>
    </div>
  );
}
