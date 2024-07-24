import {useEffect, useState} from 'react';
import write from '@/firebase/firestore/write';
import {arrayUnion, doc, getDoc, updateDoc} from '@firebase/firestore';
import db from '@/firebase/firestore/firestore';

export default function AdminMenu(props: { clubId: string; }) {
	const [meetingDate, setMeetingDate] = useState(new Date());
	const [meetingList, setMeetingList] = useState([]);
	const [members, setMembers] = useState([])

	async function handleSubmit(e: { preventDefault: () => void; }) {
		e.preventDefault()
		const packet = doc(db, 'clubs', props.clubId)
		await updateDoc(packet, {
			meetings: arrayUnion(meetingDate)
		})
	}

	async function getMeetingList() {
		const docRef = doc(db, "clubs", props.clubId);
		const docSnap = await getDoc(docRef);

			// console.log("Document data:", docSnap.data()['meetings'][0]['seconds']);
			let hold = [];
			// @ts-ignore
		for(let i = 0; i < docSnap.data()['meetings'].length; i++) {
				// @ts-ignore
				hold.push(docSnap.data()['meetings'][i].toDate().toString())
			}
			// @ts-ignore
		setMeetingList(hold)

		hold = [];
		// @ts-ignore
		setMembers(docSnap.data()['members'])


	}

	useEffect(() => {
		getMeetingList()
	}, []);

	return (
		<section className={'absolute w-screen border-2 mx-2'}>
			<h1>Admin Menu</h1>
			<form onSubmit={handleSubmit}>
				<label>Add meeting date</label>
				<input className={`form__input  ${!meetingDate && "form__input--incomplete"}`}
					   id="fromDate"
					   name="fromDate"
					   type="date"
					   autoComplete="off"
					   value={
						   meetingDate.getFullYear().toString() +
						   "-" +
						   (meetingDate.getMonth() + 1).toString().padStart(2, 0) +
						   "-" +
						   meetingDate.getDate().toString().padStart(2, 0)
					   }
					   onChange={(e) => {
						   setMeetingDate(new Date(e.target.value));
					   }}
				/>
				<button>Submit</button>
			</form>
			<div>
				<h1>Meeting List</h1>
				<div className={'grid grid-cols-2'}>
					<div>
				{meetingList.map((meeting) => (
					<p>{meeting}</p>
				))}

					</div>
				</div>
			</div>
			<div>
				{members.map((member) => (
					console.log(member),
					<p>{member['uid']}</p>
				))}
			</div>
		</section>
	)
}