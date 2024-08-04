"use client";
import { collection, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, getDocs } from "@firebase/firestore";
import { setLazyProp } from "next/dist/server/api-utils";
import Register from "@/components/clubs/Register";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AdminMenu from "@/app/clubs/[slug]/AdminMenu";
import Loading from "@/components/Loading";
import MemberName from "@/components/MemberName";
import Description from "@/app/clubs/[slug]/Description";
import Tags from "@/components/clubs/Tags";
import Admins from "@/app/clubs/[slug]/Admins";

export default function Page({ params }: { params: { slug: string } }) {
  const [club, setClub] = useState({});
  const [loading, setLoading] = useState(true);
  const [clubNotFound, setClubNotFound] = useState(false);
  const [clubId, setClubId] = useState();
  const [admins, setAdmins] = useState([]);
  const [adminIds, setAdminIds] = useState([]);
  const [isFaculty, setIsFaculty] = useState(false);
  const [uid, setUid] = useState();
  const [adminMenuOpened, setAdminMenuOpened] = useState(false);

  const [editedDescription, setEditedDescription] = useState();

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // @ts-ignore
      setUid(user.uid);
      console.log(user.uid);
      // @ts-ignore
      async function checkIfFaculty() {
        // @ts-ignore
        const docSnap = await getDoc(doc(db, "users", user.uid));
        // @ts-ignore
        if (docSnap.data()["type"] == "faculty") {
          setIsFaculty(true);
        }
      }
      checkIfFaculty();
    }
  });

  async function searchClubInfo() {
    const docSnap = await getDoc(doc(db, "clubs", params.slug));

    let hold: any = [];
    docSnap.data();
    setClubId(docSnap.id);
    setClub(docSnap.data());
    setEditedDescription(club["description"]);
    setAdminIds(docSnap.data()["admins"]);
  }

  async function searchAdmins() {
    const docSnap = await getDocs(
      collection(db, `clubs/${params.slug}/members`)
    );

    let hold: any = [];
    let adminIdHold: string[] = [];
    docSnap.forEach((doc) => {
      if (doc.data().role === "admin") {
        hold.push({ uid: doc.data()["uid"], title: doc.data()["title"] });
        adminIdHold.push(doc.data()["uid"]);
      }
    });

    setAdmins(hold);
    setAdminIds(adminIdHold);
    setLoading(false);
  }

  useEffect(() => {
    searchAdmins();
  }, []);

  useEffect(() => {
    searchClubInfo();
  }, [adminMenuOpened]);

  return (
    <section>
      {isFaculty}
      {clubNotFound ? (
        <h1>Club Not Found</h1>
      ) : (
        <div>
          {loading ? (
            <Loading />
          ) : (
            <div className={"grid grid-cols-2 mx-24 xl:mx-48 gap-4 lg:gap-0"}>
              <div>
                <h1 className={"text-4xl"}>{club["name"]}</h1>
                <img
                  className={"rounded-xl w-96"}
                  src={club["logo"]}
                  alt={`${club["name"]} logo`}
                />
              </div>

              {/*info*/}
              <div className={"mt-[2.5rem]"}>
                <Description
                  adminMenuOpened={adminMenuOpened}
                  desc={club["description"]}
                  clubId={club["url"]}
                />

                <Admins
                  admins={admins}
                  adminMenuOpened={adminMenuOpened}
                  clubId={club["url"]}
                />

                <Tags
                  tagList={club["tags"]}
                  clubId={club["url"]}
                  adminMenuOpened={adminMenuOpened}
                />
              </div>

              <div>
                {adminIds.indexOf(uid) !== -1 ? (
                  <button
                    onClick={() => {
                      setAdminMenuOpened(!adminMenuOpened);
                    }}
                    className={"border-2 p-2 bg-amber-300"}
                  >
                    Edit Club
                  </button>
                ) : (
                  <></>
                )}
                {!isFaculty ? (
                  <Register clubId={clubId} />
                ) : (
                  <button
                    onClick={() => {
                      setAdminMenuOpened(!adminMenuOpened);
                    }}
                    className={"border-2 p-2 bg-amber-300"}
                  >
                    View Club Info
                  </button>
                )}
                {adminMenuOpened ? <AdminMenu faculty clubId={clubId} /> : ""}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
