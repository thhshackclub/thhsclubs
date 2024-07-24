import {arrayUnion, doc, updateDoc} from '@firebase/firestore';
import db from '@/firebase/firestore/firestore';
import {useRef} from 'react';
import getLoggedIn from '@/components/getLoggedIn';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

export default function Register(props: { clubId: string; user: { uid: string | number; }; }) {

	const auth = getAuth();
	let uid: string;
	onAuthStateChanged(auth, (user) => {
		if (user) {

			uid = user.uid;

		}
	});

	async function handleSubmit(e: { preventDefault: () => void }) {
		e.preventDefault()
		const packet = doc(db, 'clubs', props.clubId)
		await updateDoc(packet, {
			members: arrayUnion({uid: uid, role: 'member'}) })
	}

	return (
		<button onClick={handleSubmit} className={'border-2 p-2 bg-amber-300'}>Register</button>
	)
}