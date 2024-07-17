'use client'
import React, {useState} from 'react';
import write from '@/firebase/firestore/write';

export default function Page() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [logo, setLogo] = useState("");
	const [type, setType] = useState("");
	const [url, setUrl] = useState('');
	const [error, setError] = useState(null);


	async function handleSubmit(e: { preventDefault: () => void; }) {
		e.preventDefault();
		// console.log(name, description, logo);
		await write("clubs", {name: name, description: description, logo: logo, type: type, url: url})
			.then((err) => {if(err) {
				alert(err);
			} else alert("Club Registered")})
	}
		return (
			<section>
				<h1>Register a Club</h1>
				<form onSubmit={handleSubmit}>
					<label htmlFor="name">
						<p>Club Name</p>
						<input required type="text" name="clubName" value={name} onChange={(e) => {
							setName(e.target.value)
						}} placeholder="Club Name"/>
					</label>
					<label htmlFor="description">
						<p>Club Description</p>
						<input required type="text" name="clubDescription" value={description} onChange={(e) => {
							setDescription(e.target.value)
						}} placeholder="Club Description"/>
					</label>
					<label htmlFor="logo">
						<p>Logo URL</p>
						<input required type="url" value={logo} onChange={(e) => {
							setLogo(e.target.value)
						}} placeholder="Logo URL"/>
					</label>
					<label htmlFor={'Club Type'}>
						<p>Type</p>
						<select value={type} onChange={(e) => setType(e.target.value)}>
							<option value={'club'}>Club</option>
							<option value={'academic'}>Academic Team</option>
							<option value={'sports'}>Sports Team</option>
							<option value={'publication'}>Publication</option>
						</select>
					</label>
					<label htmlFor="description">
						<p>Club URL</p>
						thhsclubs.com/<input required type="text" name="clubDescription" value={url} onChange={(e) => {
							setUrl(e.target.value)
						}} placeholder="Club URL"/>
					</label>
					<button type="submit">Register</button>
				</form>
			</section>
		)
}
