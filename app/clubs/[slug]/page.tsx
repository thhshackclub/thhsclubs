'use client'
import { collection, query, where } from "firebase/firestore";
import db from '@/firebase/firestore/firestore';
import { useParams } from "next/navigation";
import {useEffect, useState} from 'react';
import {getDocs} from '@firebase/firestore';
import {setLazyProp} from 'next/dist/server/api-utils';

export default function Page({ params }: { params: { slug: string } }) {

	const [club, setClub] = useState({});
	const [loading, setLoading] = useState(true);
	const [clubNotFound, setClubNotFound] = useState(false);

	async function search() {
		const q = query(collection(db, 'clubs'), where('url', '==', params.slug));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
			setClub(doc.data())
			if (Object.keys(doc.data()).length === 0) {
				setClubNotFound(true)
			}
			setLoading(false)

		});
	}

	useEffect(() => {
		search()
	}, []);

	return (

		<section>
			{clubNotFound ? <h1>Club Not Found</h1> :
				<div>
					{loading ? <p>Loading...</p> :
						<div>
							<h1>{club['name']}</h1>
							<img src={club['logo']} alt={`${club['name']} logo`}/>
							<p>{club['description']}</p>
							<p>Club Type: <span>{club['type'].toUpperCase()}</span></p>
						</div>
					}
				</div>
			}




		</section>
	)
}