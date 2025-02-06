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

type EncryptedTextType = { iv: string; authTag: string; ciphertext: string };

export type { NotesType, PasswordType, FolderType, FileType, EventType, EncryptionDataType, EncryptedTextType };
