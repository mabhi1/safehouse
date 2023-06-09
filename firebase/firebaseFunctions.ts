import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import "./firebase";

import auth from "./firebase";

function createErrorMessage(error: { message: string }) {
  return error.message
    .split("/")[1]
    .split(")")[0]
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

async function createUser(email: string, password: string, displayName: string) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: displayName
          .split(" ")
          .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" "),
      });
    }
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function signIn(email: string, password: string) {
  try {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function rememberSignIn(email: string, password: string) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function updatePhoto(photoUrl: string) {
  if (!auth.currentUser) return;
  try {
    await updateProfile(auth.currentUser, {
      photoURL: photoUrl,
    });
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function updateName(newName: string) {
  if (!auth.currentUser) return;
  try {
    await updateProfile(auth.currentUser, {
      displayName: newName,
    });
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function changePassword(email: string, oldPass: string, newPass: string) {
  if (!auth.currentUser) return;
  const credential = EmailAuthProvider.credential(email, oldPass);
  try {
    const authenticated = await reauthenticateWithCredential(auth.currentUser, credential);
    if (authenticated) {
      await updatePassword(auth.currentUser, newPass);
    }
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function passwordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

async function dosignOut() {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw createErrorMessage(error);
  }
}

export { createUser, dosignOut, passwordReset, changePassword, signIn, rememberSignIn, updatePhoto, updateName };
