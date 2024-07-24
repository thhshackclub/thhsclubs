'use client'
import { collection, query, where } from "firebase/firestore";
import db from '@/firebase/firestore/firestore';
import { useParams } from "next/navigation";
import {useEffect, useState} from 'react';
import {getDocs} from '@firebase/firestore';
import {setLazyProp} from 'next/dist/server/api-utils';
import Register from '@/components/clubs/Register';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import AdminMenu from '@/app/clubs/[slug]/AdminMenu';

export default function Page({ params }: { params: { slug: string } }) {

	const [club, setClub] = useState({});
	const [loading, setLoading] = useState(true);
	const [clubNotFound, setClubNotFound] = useState(false);
	const [clubId, setClubId] = useState();
	const [adminIds, setAdminIds] = useState([]);
	const [uid, setUid] = useState()
	const [adminMenuOpened, setAdminMenuOpened] = useState(false)

	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		if (user) {

			// @ts-ignore
			setUid(user.uid);

		}
	});

	async function search() {
		const q = query(collection(db, 'clubs'), where('url', '==', params.slug));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
			setClubId(doc.id)
			setClub(doc.data())
			let hold = [];
			for(let i = 0; i < doc.data()['members'].length; i++) {
				if (doc.data()['members'][i].role === 'admin') {
					hold.push(doc.data()['members'][i].uid)
				}
			}
			setAdminIds(hold)
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

							Admins: {adminIds} <br/>
							{adminIds.indexOf(uid) !== -1 ? <button onClick={() => {setAdminMenuOpened(!adminMenuOpened)}} className={'border-2 p-2 bg-amber-300'}>Edit Club</button> : <></>}
							{adminMenuOpened ? <AdminMenu clubId={clubId}/> : ''}
							<Register clubId={clubId}/>

						</div>


					}

				</div>
			}




		</section>
	)
}