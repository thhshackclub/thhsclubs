'use client'
import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ListItems from '@/components/ListItems';
import AddItem from '@/components/AddItem';

function Page() {
	const { user } = useAuthContext()
	const router = useRouter()

	React.useEffect(() => {
		if (user == null) router.push("/")
	}, [user])

	return (<><AddItem/><ListItems/></>);
}

export default Page;