import CategoryList from "@/components/pages/expenses/categories/category-list";
import { getAllCategories } from "@/prisma/db/expenses";
import { auth } from "@clerk/nextjs/server";

export default async function ExpenseCategoryPage() {
  const { userId, redirectToSignIn } = auth();
  if (!userId) redirectToSignIn();

  const { data, error } = await getAllCategories(userId!);
  if (!data || error) throw new Error("Error fetching categories");

  return <CategoryList categories={data} />;
}
