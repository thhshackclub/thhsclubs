"use client";
import { useEffect, useState } from "react";
import { collection, doc, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { getDoc, getDocs } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ClubCard from "@/components/clubs/ClubCard";

export default function Page() {
  const [clubs, setClubs] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const auth = getAuth();
  let uid: string;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
    }
  });

  async function searchClubs() {
    const docSnap = await getDocs(collection(db, `clubs`));

    docSnap.forEach((d) => {
      getDoc(doc(db, `clubs/${d.id}/members/${uid}`)).then((doc) => {
        // console.log(d.id);
        if (doc.exists()) {
          setClubs((clubs) => [...clubs, d.id]);
        }
      });
    });
    setLoading(false);
  }

  useEffect(() => {
    searchClubs();
  }, []);

  return (
    <div>
      <h1>My Clubs</h1>
      <div className={"grid grid-cols-3 gap-10"}>
        {clubs.map((club, i) => {
          return <ClubCard key={i} club={club} />;
        })}
      </div>
      {/*{!loading ? <ClubCard club={clubs} /> : ""}*/}
    </div>
  );
}
