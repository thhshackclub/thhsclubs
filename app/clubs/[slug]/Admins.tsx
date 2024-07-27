import MemberName from '@/components/MemberName';
import {PlusSquare} from 'react-feather';
import {useState} from 'react';
import {addDoc, collection, doc, query, where} from 'firebase/firestore';
import db from '@/firebase/firestore/firestore';
import {arrayUnion, getDocs, setDoc, updateDoc} from '@firebase/firestore';
import {update} from '@firebase/database';

export default function Admins(props: {
	clubId: string;
	adminMenuOpened: boolean;
	admins: any[]; }) {

	const [newAdmin, setNewAdmin] = useState('')
	const [title, setTitle] = useState('')


	async function handleSubmit(e: { preventDefault: () => void; }) {
		e.preventDefault()
		console.log('submit')
			const q = query(collection(db, 'users'), where('OSIS', '==', newAdmin));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((d) => {
				setDoc(doc(db, `clubs/${props.clubId}/members`, d.id), {
					// @ts-ignore
					role: 'admin', title: title, uid: d.id
				})
				// @ts-ignore
				updateDoc(doc(db, `clubs/${props.clubId}`), {admins: arrayUnion(d.id)})
			});
	}

	return <div className={'my-10'}>
		<h2>Executive Board</h2>

		{props.admins.map((adminId, i) => {
			return <li key={i} className={'flex items-baseline gap-2'}>
				<p className={'text-xl'}><MemberName uid={adminId['uid']} displayOnly/></p>
				<span>{adminId['title']}</span>
			</li>
		})}
		{props.adminMenuOpened ? <div className={'border-t-2'}>
			<input placeholder={'OSIS Number'} type={'number'} value={newAdmin}
				   onChange={(e) => setNewAdmin(e.target.value)}/>
			<input placeholder={'Title'}  value={title}
				   onChange={(e) => setTitle(e.target.value)}/>

			<button className={'border-0'} onClick={handleSubmit}><PlusSquare/></button>
		</div> : null}
	</div>
}