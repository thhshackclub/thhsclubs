import {addDoc, collection, doc} from 'firebase/firestore';
import db from '@/firebase/firestore/firestore';
import {setDoc} from '@firebase/firestore';

export default async function write(path: string, data: object, clubId:string) {
	try {
		const docRef = await setDoc(doc(db, path, clubId), data);
		console.log("Document written with ID: ", docRef.id);
	} catch (e) {
		console.error("Error adding document: ", e);
		return e;
	}
}