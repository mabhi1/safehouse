import prisma from "..";

export async function getAllCurrencies(type?: { onlyUsed: boolean }) {
  try {
    const data = type?.onlyUsed
      ? await prisma.currency.findMany({ where: { expenses: { some: {} } } })
      : await prisma.currency.findMany();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function getAllCategories(userId: string) {
  try {
    const data = await prisma.category.findMany({
      select: { id: true, name: true, expenses: { where: { uid: userId }, select: { id: true } } },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function getAllPaymentTypes(userId: string) {
  try {
    const data = await prisma.paymentType.findMany({
      select: { id: true, name: true, expenses: { where: { uid: userId }, select: { id: true } } },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function getAllExpenses() {
  try {
    const data = await prisma.expense.findMany();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function getExpensesByUser(uid: string) {
  try {
    const data = await prisma.expense.findMany({
      where: {
        uid,
      },
      orderBy: { date: "desc" },
      include: {
        category: { select: { name: true, id: true } },
        currency: { select: { name: true, code: true, symbol: true, id: true } },
        paymentType: { select: { name: true, id: true } },
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function getExpensesByUserAndDate(uid: string, startDate: Date, endDate: Date) {
  try {
    const data = await prisma.expense.findMany({
      where: {
        uid,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: "desc" },
      include: {
        category: { select: { name: true, id: true } },
        currency: { select: { name: true, code: true, symbol: true, id: true } },
        paymentType: { select: { name: true, id: true } },
      },
    });

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export async function createExpenseByUser(
  amount: number,
  categoryId: string,
  paymentTypeId: string,
  currencyId: string,
  date: Date,
  title: string,
  description: string,
  uid: string
) {
  try {
    const data = await prisma.expense.create({
      data: {
        currencyId,
        amount,
        categoryId,
        paymentTypeId,
        date,
        title,
        description,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getExpenseByIdAndUser(id: string, uid: string) {
  try {
    const data = await prisma.expense.findUnique({
      where: {
        id,
        uid,
      },
      include: {
        category: { select: { name: true, id: true } },
        currency: { select: { name: true, code: true, symbol: true, id: true } },
        paymentType: { select: { name: true, id: true } },
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getExpenseById(id: string) {
  try {
    const data = await prisma.expense.findUnique({
      where: {
        id,
      },
      include: {
        category: { select: { name: true, id: true } },
        currency: { select: { name: true, code: true, symbol: true, id: true } },
        paymentType: { select: { name: true, id: true } },
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateExpenseById(
  id: string,
  amount: number,
  categoryId: string,
  paymentTypeId: string,
  currencyId: string,
  date: Date,
  title: string,
  description: string,
  uid: string
) {
  try {
    const data = await prisma.expense.update({
      where: {
        id,
        uid,
      },
      data: {
        currencyId,
        amount,
        categoryId,
        paymentTypeId,
        date,
        title,
        description,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteExpenseById(id: string, uid: string) {
  try {
    const data = await prisma.expense.delete({
      where: {
        id,
        uid,
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function searchExpensesByText(text: string, userId: string) {
  try {
    if (text.trim().length < 3) return { data: [], error: null };
    const data = await prisma.expense.findMany({
      where: {
        OR: [
          { title: { contains: text, mode: "insensitive" } },
          { description: { contains: text, mode: "insensitive" } },
        ],
        uid: userId,
      },
      include: {
        category: { select: { name: true, id: true } },
        currency: { select: { name: true, code: true, symbol: true, id: true } },
        paymentType: { select: { name: true, id: true } },
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteMultipleExpensesById(ids: string[], uid: string) {
  try {
    // Delete expenses one by one to ensure each one belongs to the user
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const data = await prisma.expense.delete({
            where: {
              id,
              uid,
            },
          });
          return { success: true, id };
        } catch (error) {
          return { success: false, id, error };
        }
      })
    );

    return {
      data: results,
      error: null,
      successCount: results.filter((r) => r.success).length,
      failureCount: results.filter((r) => !r.success).length,
    };
  } catch (error) {
    return { data: null, error };
  }
}
