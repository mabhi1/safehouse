import prisma from "..";

export async function getAllCurrencies() {
  try {
    const data = await prisma.currency.findMany({
      orderBy: {
        code: "asc",
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error getting currencies:", error);
    return { data: null, error: "Failed to get currencies" };
  }
}

export async function getCurrencyById(id: string) {
  try {
    const data = await prisma.currency.findUnique({
      where: {
        id,
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error getting currency:", error);
    return { data: null, error: "Failed to get currency" };
  }
}
