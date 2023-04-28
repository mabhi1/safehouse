import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { FileType, FolderType } from "../types/dbTypes";
import { db } from "@/firebase/firebase";

type props = {
  folderId: string;
  currentUser: string;
};

const getCurrentFolder = async ({ folderId, currentUser }: props) => {
  const docSnap = await getDoc(doc(db, "folders", folderId));
  if (docSnap.data()?.uid !== currentUser) throw new Error("Unauthorized Access");
  return { id: docSnap.id, path: docSnap.data()?.path, name: docSnap.data()?.name, ...docSnap.data() };
};

const getFolders = async ({ folderId, currentUser }: props) => {
  const newFolders: FolderType[] = [];
  const folderQuery = query(collection(db, "folders"), where("parentId", "==", folderId), where("uid", "==", currentUser), orderBy("createdAt"));
  const folderSnapshot = await getDocs(folderQuery);
  folderSnapshot.forEach((doc) => {
    newFolders.push({ ...doc.data(), path: doc.data().path, name: doc.data().name, id: doc.id });
  });
  return newFolders;
};

const getFolderSnapshot = async ({ folderId, currentUser }: props) => {
  const folderQuery = query(collection(db, "folders"), where("parentId", "==", folderId), where("uid", "==", currentUser), orderBy("createdAt"));
  const folderSnapshot = await getDocs(folderQuery);
  return folderSnapshot;
};

const getFiles = async ({ folderId, currentUser }: props) => {
  const newFiles: FileType[] = [];
  const fileQuery = query(collection(db, "files"), where("parentId", "==", folderId), where("uid", "==", currentUser), orderBy("createdAt"));
  const fileSnapshot = await getDocs(fileQuery);
  fileSnapshot.forEach((doc) => {
    newFiles.push({ ...doc.data(), uid: doc.data().uid, url: doc.data().url, name: doc.data().name, dbId: doc.data().dbId, id: doc.id });
  });
  return newFiles;
};

export { getFolders, getCurrentFolder, getFiles, getFolderSnapshot };
