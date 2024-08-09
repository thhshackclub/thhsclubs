import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirebaseErrorMessage } from "@/firebase/getFirebaseErrorMessage";

const auth = getAuth(firebase_app);

export default async function signIn(email: string, password: string) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = getFirebaseErrorMessage(e.code);
  }

  return { result, error };
}
