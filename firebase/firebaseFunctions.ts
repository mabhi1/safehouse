import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import "./firebase";

const auth = getAuth();

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
    await signInWithEmailAndPassword(auth, email, password);
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

export { createUser, dosignOut, passwordReset, signIn };
