import { addDoc, collection, doc } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { setDoc } from "@firebase/firestore";

export default async function write(path: string, data: object) {
  try {
    const docRef = await setDoc(doc(db, path), data);
    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    return e;
  }
}
