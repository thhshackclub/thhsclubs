import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import write from "@/firebase/firestore/write";

const auth = getAuth(firebase_app);


export default async function signUp(email:string, password:string, fName: string, lName: string, osis: number, accountType: string, grade: number) {
	let result = null,
		error = null;
	try {
		result = await createUserWithEmailAndPassword(auth, email, password);
		result = await write("users", {name: {fName: fName, lName: lName}, OSIS: osis, grade: grade, type: accountType});
	} catch (e) {
		error = e;
	}

	return { result, error };
}
