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

export type { NotesType, PasswordType };
