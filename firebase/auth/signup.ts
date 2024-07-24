import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import write from "@/firebase/firestore/write";

const auth = getAuth(firebase_app);


export default async function signUp(email:string, password:string, fName: string, lName: string, osis: number, accountType: string, grade: number) {
	let result = null,
		error = null,
		uid;
	try {
		result = await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {uid=userCredential.user.uid; updateProfile(auth.currentUser, {displayName: fName + " " + lName})} );

		result = await write("users", {name: {fName: fName, lName: lName}, OSIS: osis, grade: grade, type: accountType, uid: uid});
	} catch (e) {
		error = e;
	}

	return { result, error };
}
