"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import Tags from "@/components/clubs/Tags";

export default function Page() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "clubs"));
      setClubs(
        // @ts-ignore
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchItems().then((r) => {});
  }, []);

  return (
    <div className="px-10 text-center p-4">
      <h1>Discover Clubs</h1>
      <section className={"grid gap-4 xl:grid-cols-3 lg:grid-cols-2"}>
        {clubs.map((club, i) => {
          if (!club["testing"])
            return (
              <a key={i} href={`/clubs/${club["url"]}`}>
                <div
                  key={club["id"]}
                  className="border-2 border-dark rounded-2xl p-2 flex flex-col gap-2"
                >
                  <h2 className={"font-bold text-2xl"}>{club["name"]}</h2>
                  <img
                    src={club["logo"]}
                    alt={`${club["name"]} Logo`}
                    className={"w-64 mx-auto rounded-3xl drop-shadow-xl"}
                  />
                  <div className={"line-clamp-3"}>
                    <p className={""}>{club["description"]}</p>
                  </div>
                  <div>
                    <Tags tagList={club["tags"]} clubId={club["url"]} />
                  </div>
                </div>
              </a>
            );
        })}
      </section>
    </div>
  );
}
