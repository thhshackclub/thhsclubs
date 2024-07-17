'use client'
import { collection, query, where } from "firebase/firestore";
import db from '@/firebase/firestore/firestore';
import { useParams } from "next/navigation";
import {useEffect, useState} from 'react';
import {getDocs} from '@firebase/firestore';

export default function Page({ params }: { params: { slug: string } }) {

	useEffect( () => {
		async function fe() {
			const q = query(collection(db, "clubs"), where("url", "==", params.slug))
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				console.log(doc.id, " => ", doc.data());
			});
		}

		fe()
	}, []);



	return (
		<section>
			<h1>{params.slug}</h1>

		</section>
	)
}