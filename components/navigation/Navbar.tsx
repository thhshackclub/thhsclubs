'use client'
import {useRef, useState} from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from 'react-feather'


export default function Navbar() {
	const [user, setUser] = useState(null);

	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/auth.user
			// @ts-ignore
			setUser(user.uid);
			// @ts-ignore
			//  user.uid;
		} else {
			// User is signed out
			// ...
		}
	});

	return (
		<section className={'w-screen bg-green-200 flex justify-around'}>
			<p>navbar</p>

			<p>{user}</p>
			<User/>
		</section>
	)
}