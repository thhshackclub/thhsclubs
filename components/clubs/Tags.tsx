export default function Tags(props: { tagList: any[] }) {
	return <>
		{props.tagList.map((tag, i:number) => {return <p key={i}
														className={'rounded-3xl border-2 bg-yellow-200 inline-block w-fit px-4 py-1'}>{tag['label']}</p>
		})}
	</>
}