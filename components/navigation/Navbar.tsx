'use client'
import {useState} from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from 'react-feather'


export default function Navbar() {
	const [user, setUser] = useState(null);

	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/auth.user
			const uid = user.uid;
			setUser(user.displayName);
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