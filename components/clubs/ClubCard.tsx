import Tags from "@/components/clubs/Tags";
import { getDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { useEffect, useState } from "react";

export default function ClubCard(props: { club: string }) {
  const [clubsList, setClubsList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getClubDetail() {
    let hold = [];

    const snap = await getDoc(doc(db, `clubs/${props.club}`));
    console.log(snap.data());
    hold.push(snap.data());
    setClubsList(hold);
  }

  useEffect(() => {
    getClubDetail()
      .then((r) => setLoading(false))
      .then(() => console.log(clubsList))
      .catch((e) => console.log(e));
  }, []);

  return (
    <section>
      {clubsList.map((club) => (
        <a href={`/clubs/${club["url"]}`}>
          <div key={club["id"]} className="rounded-2xl p-2 flex flex-col">
            <h2 className={"text-center"}>{club["name"]}</h2>
            <img
              src={club["logo"]}
              alt={`${club["name"]} Logo`}
              className={"w-64 mx-auto rounded-3xl"}
            />
          </div>
        </a>
      ))}
    </section>
  );
}
