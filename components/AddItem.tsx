import {useState} from 'react';
import db from '@/firebase/firestore/firestore';
import { collection, addDoc } from "firebase/firestore";

export default function AddItem() {
	const [value, setValue] = useState('');

	const handleSubmit = async (event: { preventDefault: () => void; }) => {
		event.preventDefault();
		try {
			const docRef = await addDoc(collection(db, "users"), {
				name: value
			});
			console.log("Document written with ID: ", docRef.id);
			setValue(''); // Clear the form
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Add a new item"
			/>
			<button type="submit">Add Item</button>
		</form>
	);
}