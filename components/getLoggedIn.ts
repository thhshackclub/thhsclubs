import { getAuth, onAuthStateChanged } from "firebase/auth";
import {useState} from 'react';

export default async function getLoggedIn() {
	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		if (user) {

			return (user.uid);

		}
	});
}