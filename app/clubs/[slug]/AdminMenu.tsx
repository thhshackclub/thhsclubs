import {Suspense, useEffect, useState} from 'react';
import write from '@/firebase/firestore/write';
import {arrayUnion, doc, getDoc, getDocs, updateDoc} from '@firebase/firestore';
import db from '@/firebase/firestore/firestore';
import {collection, query, where} from 'firebase/firestore';
import MemberName from '@/components/MemberName';
import moment from 'moment';

export default function AdminMenu(props: { clubId: string; }) {
	const [meetingDate, setMeetingDate] = useState(new Date());
	const [meetingList, setMeetingList] = useState([]);
	const [members, setMembers] = useState([])
	const packet = doc(db, 'clubs', props.clubId)

	async function handleSubmit(e: { preventDefault: () => void; }) {
		e.preventDefault()
		await updateDoc(packet, {
			meetings: arrayUnion({date: meetingDate, attendance: []})
		})
		getMeetingList()
	}

	async function getMeetingList() {
		const docRef = doc(db, "clubs", props.clubId);
		const docSnap = await getDoc(docRef);

			// console.log("Document data:", docSnap.data()['meetings'][0]['seconds']);
			let hold = [];
			// @ts-ignore
		for(let i = 0; i < docSnap.data()['meetings'].length; i++) {
				// @ts-ignore
				hold.push(docSnap.data()['meetings'][i]['date'].toDate().toString())
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

	async function handleCheckbox(meetingNumber:number, user:number) {
		console.log('checked')
		await updateDoc(packet, {
			meetings: arrayUnion({uid: members[user]['uid'], present: true})
		})
	}

	return (
		<section className={'absolute w-screen border-2 mx-2'}>
			<h1>Admin Menu</h1>
			<h2>Meetings</h2>
			<form onSubmit={handleSubmit}>
				<h3>Add meeting date</h3>
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
				<h3>Meeting List</h3>
				<div className={'grid grid-cols-2'}>
					<div>
				{meetingList[0] ? meetingList.map((meeting, i) => (
					<p key={i}>{meeting}</p>
				)): <p>No meetings scheduled.</p>}

					</div>
				</div>
			</div>
			<h1>Members</h1>
			<div className={'grid gap-4 grid-cols-10'}>
				{meetingList.map((meeting, i) => {return <div key={i}>
					<p>{moment(meeting).format('MM/DD/YY')}</p>
					{members.map((member, j) => {
						return <div key={j}>
							<input type={'checkbox'} onChange={handleCheckbox(i, j)}/>
						</div>
					})}
				</div>})}
			</div>
			{/*<div>*/}
			{/*	{members.map((member, i) => (*/}
			{/*		<MemberName clubId={props.clubId} uid={member['uid']} key={i}/>*/}
			{/*	))}*/}
			{/*</div>*/}
		</section>
	)
}