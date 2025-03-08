"use server";

import { db } from "@/firebase";
import { FileType, FolderType } from "@/lib/db-types";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { v4 as uuidV4 } from "uuid";

export async function addFolder(
  name: string,
  folderId: string,
  currentFolderPath:
    | {
        id: string;
        path: any;
        name: any;
      }
    | undefined,
  userId: string,
  folders: FolderType[],
  pathname: string
) {
  const newId = uuidV4();
  try {
    for (let doc of folders) {
      if (doc.name.toLowerCase() === name.toLowerCase()) throw new Error();
    }
    await setDoc(doc(db, "folders", newId), {
      name,
      path:
        folderId !== "root"
          ? [...currentFolderPath?.path, { id: folderId, name: currentFolderPath?.name }]
          : [{ id: "root", name: "root" }],
      parentId: folderId,
      uid: userId,
      createdAt: serverTimestamp(),
    });
    revalidatePath(pathname);
    return { data: true, error: null };
  } catch (error) {
    return { data: null, error: true };
  }
}

export async function renameFolder(userId: string, name: string, folderId: string, pathname: string) {
  try {
    let error = false;
    // edit all folders inside
    const folderQuery = query(collection(db, "folders"), where("uid", "==", userId));
    const folderSnapshot = await getDocs(folderQuery);
    folderSnapshot.forEach((dir) => {
      const data = dir.data();
      if (data.uid !== userId) error = true;
      if (data.name.toLowerCase() === name.toLowerCase()) {
        error = true;
      }

      if (!error)
        data.path.map(async (p: FolderType) => {
          if (p.id === folderId) {
            await updateDoc(doc(db, "folders", dir.id), {
              path: data.path.map((each: FolderType) => {
                if (each.id === folderId) {
                  each.name = name;
                }
                return each;
              }),
            });
            return;
          }
        });
    });
    if (error) {
      throw new Error();
    }

    const editedFolder = doc(db, "folders", folderId);
    await updateDoc(editedFolder, {
      name: name,
    });

    // edit all files inside
    const fileQuery = query(collection(db, "files"), where("uid", "==", userId));
    const fileSnapshot = await getDocs(fileQuery);
    fileSnapshot.forEach((dir) => {
      const data = dir.data();
      data.path.map(async (p: FileType) => {
        if (p.id === folderId) {
          await updateDoc(doc(db, "files", dir.id), {
            path: data.path.map((each: FileType) => {
              if (each.id === folderId) {
                each.name = name;
              }
              return each;
            }),
          });
          return;
        }
      });
    });
    revalidatePath(pathname);
    return { data: true, error: null };
  } catch (error) {
    return { data: null, error: true };
  }
}

export async function searchDocuments(text: string, userId: string) {
  try {
    if (text.trim().length < 3) return { data: [], error: null };

    // Search for files
    const fileQuery = query(collection(db, "files"), where("uid", "==", userId));
    const fileSnapshot = await getDocs(fileQuery);

    const files: FileType[] = [];
    fileSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name.toLowerCase().includes(text.toLowerCase())) {
        files.push({
          id: doc.id,
          name: data.name,
          dbId: data.dbId,
          url: data.url,
          uid: data.uid,
        });
      }
    });

    return { data: files, error: null };
  } catch (error) {
    return { data: null, error: true };
  }
}
