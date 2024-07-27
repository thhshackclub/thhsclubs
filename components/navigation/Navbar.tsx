'use client'
import {useRef, useState} from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from 'react-feather'
import MemberName from '@/components/MemberName';


export default function Navbar() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/auth.user
			// @ts-ignore
			setUser(user.uid);
			setLoading(false)
		} else {
			// User is signed out
			// ...
		}
	});

	return (
		<section className={'w-screen bg-green-200 flex justify-between px-20'}>
			<p className={'font-black text-xl'}>THHS Clubs</p>
			<a href={'/clubs'}>Discover</a>
			<a href={'/myclubs'}>My Clubs</a>
			<div className={'flex gap-2'}>
				<User/>
				<span>{loading? '' : user}</span>
				<span>{loading? '' : <MemberName displayOnly uid={user}/>}</span>
			</div>

		</section>
	)
}