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
		<div className="border px-10 text-center p-4">
			<h1>Clubs</h1>
			<section className={'grid gap-4 grid-cols-3'}>
				{clubs.map((club) => (
					<a href={`/clubs/${club['url']}`}>
					<div key={club['id']} className="border-2 border-black rounded-2xl p-2">
						<h2>{club['name']}</h2>
						<img src={club['logo']} alt={`${club['name']} Logo`} className={'w-64 mx-auto rounded-3xl'}/>
						<div className={'line-clamp-3'}>
							<p className={''}>{club['description']}</p>
						</div>
						<p className={'rounded-3xl border-2 bg-yellow-200 w-fit px-4 py-1'}>{club['type']}</p>
					</div>
					</a>
				))}
			</section>
		</div>
	)
}