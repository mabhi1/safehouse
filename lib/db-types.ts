type NotesType = {
  id: string;
  title: string;
  description: string;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
};

type PasswordType = {
  id: string;
  password: string;
  site: string;
  uid: string;
  updatedAt: Date;
  username: string;
};

type FolderType = {
  id: string;
  name: string;
  path: {
    id: string;
    name: string;
  }[];
};

type FileType = {
  id: string;
  name: string;
  dbId: string;
  url: string;
  uid: string;
};

type EventType = {
  id: string;
  title: string;
  description: string;
  date: Date;
  uid: string;
  updatedAt: Date;
};

type EncryptionDataType = {
  id: string;
  salt: string;
  hash: string;
  recovery: string;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
};

type ExpenseType = {
  id: string;
  amount: number;
  category: { id: string; name: string };
  categoryId: string;
  paymentType: { id: string; name: string };
  paymentTypeId: string;
  currency: { id: string; code: string; name: string; symbol: string };
  currencyId: string;
  date: Date;
  title: string;
  description: string | null;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
};

type ExpenseCategoryType = {
  id: string;
  name: string;
  expenses: { id: string }[];
};

type ExpenseCurrencyType = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  createdAt: Date;
  updatedAt: Date;
};

type EncryptedTextType = { iv: string; authTag: string; ciphertext: string };

type BookmarkType = {
  id: string;
  title: string;
  comment: string;
  url: string;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
};

interface UserResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

interface Expense {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: Currency;
  paidBy: string;
  addedBy: string;
  splitType: "equal" | "percentage" | "amount";
  createdAt: Date;
  updatedAt: Date;
  user: UserResult;
  isPaidByRemovedUser?: boolean;
  shares: Share[];
  history?: {
    id: string;
    updatedBy: string;
    changes: Record<string, { old: any; new: any }>;
    createdAt: Date;
  }[];
  imageUrl?: string | null;
}

interface Member {
  id: string;
  userId: string;
  user: UserResult;
}

interface Share {
  id: string;
  amount: number;
  percentage?: number | null;
  member: Member & {
    isRemovedUser?: boolean;
  };
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export type {
  NotesType,
  PasswordType,
  FolderType,
  FileType,
  EventType,
  EncryptionDataType,
  EncryptedTextType,
  ExpenseType,
  ExpenseCategoryType,
  ExpenseCurrencyType,
  BookmarkType,
  UserResult,
  Expense,
  Member,
  Share,
  Currency,
};
