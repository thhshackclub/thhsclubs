'use client'
import {useEffect, useState} from 'react';
import read from '@/firebase/firestore/read';
import {collection, getDocs} from 'firebase/firestore';
import db from '@/firebase/firestore/firestore';
import DeleteItem from '@/components/DeleteItem';
import Register from '@/components/clubs/Register';

export default function Page() {
	const [clubs, setClubs] = useState([])

	useEffect(() => {
		const fetchItems = async () => {
			const querySnapshot = await getDocs(collection(db, "clubs"))
			setClubs(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		}

		fetchItems()
	}, [])

	return (
		<div className="border w-96 text-center p-4">
			<h1>Clubs</h1>
			<ul>
				{clubs.map((club) => (
					<li key={club['id']} className="border-t-2 p-2">
						<h2>{club['name']}</h2>
						<p>{club['description']}</p>
						<p>{club['type']}</p>
						<img src={club['logo']} alt={`${club['name']} Logo`}/>
					</li>
				))}
			</ul>
		</div>
	)
}