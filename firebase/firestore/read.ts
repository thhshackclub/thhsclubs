import db from '@/firebase/firestore/firestore';
import { collection, getDocs } from "firebase/firestore"

export default async function read(path: string) {
	const querySnapshot = await getDocs(collection(db, path))
	return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

}