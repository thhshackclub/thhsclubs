import {collection, query, where} from 'firebase/firestore';
import db from '@/firebase/firestore/firestore';
import {doc, getDoc, getDocs} from '@firebase/firestore';
import {useEffect, useState} from 'react';
import moment from 'moment';

export default function  MemberName(props: {
	meetingId: string;
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
			console.log(props.meetingId)
			const docSnap = await getDoc(doc(db, `clubs/${props.clubId}/attendance`, props.meetingId));
			// console.log(docSnap.data())
			// @ts-ignore
			docSnap.data()['present'].includes(props.uid) ? setChecked(true) : setChecked(false);
		}



		read().then(r => {})
		getAttendance().then(r => {})

	}, []);


	if (props.displayOnly) return <div>
		<p>{name}</p>
	</div>
	else return <div>
		<input type={'checkbox'} name={name} id={`${props.meetingId}${props.uid}${checked?'true':'false'}`} checked={checked} onChange={() => setChecked(!checked)} />
		<label>{name}</label>
	</div>
}