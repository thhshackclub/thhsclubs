import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import write from "@/firebase/firestore/write";
import {addDoc, collection, doc} from 'firebase/firestore';
import db from '@/firebase/firestore/firestore';
import {setDoc} from '@firebase/firestore';

const auth = getAuth(firebase_app);


export default async function signUp(
  email: string,
  password: string,
  fName: string,
  lName: string,
  osis: number | undefined,
  accountType: string,
  grade: number
) {
  let result = null,
    error = null,
    uid;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        uid = userCredential.user.uid;
        updateProfile(auth.currentUser, { displayName: fName + " " + lName });
      }
    );

    result = setDoc(doc(db, "users", `${uid}`), {
      email: email,
      name: { fName: fName, lName: lName },
      OSIS: osis,
      grade: grade,
      type: accountType,
      uid: uid,
    });

    // result = await write("users", {name: {fName: fName, lName: lName}, OSIS: osis, grade: grade, type: accountType, uid: uid});
  } catch (e) {
    error = e;
  }

  return { result, error };
}
