import {Suspense, useEffect, useState} from 'react';
import write from '@/firebase/firestore/write';
import {arrayUnion, doc, getDoc, getDocs, setDoc, updateDoc} from '@firebase/firestore';
import db from '@/firebase/firestore/firestore';
import {addDoc, collection, query, where} from 'firebase/firestore';
import MemberName from '@/components/MemberName';
import moment from 'moment';

export default function AdminMenu(props: { clubId: string; }) {
	const [meetingDate, setMeetingDate] = useState(new Date());
	const [meetingList, setMeetingList] = useState([]);
	const [members, setMembers] = useState([])

	async function handleSubmit(e: { preventDefault: () => void; }) {
		e.preventDefault()
		await setDoc(doc(db, 'clubs', props.clubId, 'attendance', moment(meetingDate).format('MMDDYY')), {
			date: meetingDate, present: []
		})
		getMeetingList()
	}

	async function getMeetingList() {
		const docSnap = await getDocs(collection(db, `clubs/${props.clubId}/attendance`));
		let hold:any = [];

		docSnap.forEach((doc) => {
			hold.push({date: doc.data()['date'].toDate().toString(), present: doc.data()['present']})
		})
		setMeetingList(hold)

		hold = [];
	}

	async function getMembers() {
		const docSnap = await getDocs(collection(db, `clubs/${props.clubId}/members`));

		let hold:any = []
		docSnap.forEach((doc) => {
			hold.push({uid: doc.data()['uid'], role: doc.data()['role']})
		})
		setMembers(hold)
	}

	useEffect(() => {
		getMeetingList()
		getMembers()
	}, []);

	async function handleAttendanceSubmission(meeting:string) {
		for (let i in members) {
			let ele = document.getElementById(members[i]['uid']) as HTMLInputElement
			// console.log(document.getElementById(members[i]['uid']).id)
			if (document.getElementById(members[i]['uid']+'true')) {
				await updateDoc(doc(db, 'clubs', props.clubId, 'attendance', meeting), {
					present: arrayUnion(members[i]['uid'])
				})
				}
			}
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
					<div>
						<p key={i}>{meeting['date']}</p>
						<div>
							{/*{meeting['present'].map((member, j) => { return <li key={j}><MemberName uid={member} clubId={props.clubId}/></li> }) }*/}
							{members.map((member, i) => (
								<MemberName clubId={props.clubId} uid={member['uid']} key={i}/>
							))}
						</div>
						{/*<button>Mark All Present</button>*/}
						<button onClick={(e) => {
							e.preventDefault()
							handleAttendanceSubmission(moment(meeting['date'].split( 'at' )[0]).format('MMDDYY'))}}>Submit</button>
					</div>
				)) : <p>No meetings scheduled.</p>}

					</div>
				</div>
			</div>
			<h1>Members</h1>
			{/*<div className={'grid gap-4 grid-cols-10'}>*/}
			{/*	{members.map( (member, i) => {return <div key={i}>{member['uid']}</div>} )}*/}
			{/*</div>*/}
			<div>
				{members.map((member, i) => (
					<MemberName displayOnly clubId={props.clubId} uid={member['uid']} key={i}/>
				))}
			</div>
		</section>
	)
}