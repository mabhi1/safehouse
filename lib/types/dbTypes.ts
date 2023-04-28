type NotesType = {
  id: string;
  name: string;
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

type TaskType = {
  id: string;
  title: string;
  description: string;
  from: string;
  to: string;
  uid: string;
  updatedAt: Date;
};

type CardType = {
  id: string;
  bank: string;
  cvv: string;
  expiry: string;
  number: string;
  type: "credit" | "debit";
  uid: string;
  updatedAt: Date;
};

export type { NotesType, PasswordType, FolderType, FileType, TaskType, CardType };
