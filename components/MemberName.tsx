import {collection, query, where} from 'firebase/firestore';
import db from '@/firebase/firestore/firestore';
import {doc, getDoc, getDocs} from '@firebase/firestore';
import {useEffect, useState} from 'react';
import moment from 'moment';

export default function  MemberName(props: {
	displayOnly?: boolean;
	uid: string, clubId: string }) {
	const [name, setName] = useState('');
	const [attendance, setAttendance] = useState([]);
	const [checked, setChecked] = useState(false);
	useEffect(() => {
		async function read() {
			const q = query(collection(db, 'users'), where('uid', '==', props.uid));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				// console.log(doc.id, " => ", doc.data());
				setName(doc.data().name['fName'] + ' ' + doc.data().name['lName']);
			});
		}

		async function getAttendance() {
			// 	see if person was here
			const docRef = doc(db, "clubs", props.clubId);
			const docSnap = await getDoc(docRef);

			let hold = [];
			// @ts-ignore

			let meetings = docSnap.data()['meetings']

			for(let i = 0; i < meetings.length; i++) {
				// @ts-ignore
				for(let j = 0; j < meetings[i]['attendance'].length; j++) {
					if (meetings[i]['attendance'][j]['uid'] === props.uid) {
						console.log(meetings[i]['date'])
						hold.push(meetings[i]['date'].toDate().toString())
					}
				}
			}
			// @ts-ignore
			setAttendance(hold)
		}



		read()
		// getAttendance()

	}, []);


	if (props.displayOnly) return <div>
		<p>{name}</p>
	</div>
	else return <div>
		<input type={'checkbox'} name={name} id={`${props.uid}${checked?'true':''}`} checked={checked} onChange={() => setChecked(!checked)} />
		<label>{name}</label>
	</div>
}