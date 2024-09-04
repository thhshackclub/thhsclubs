"use client";
import { collection, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, getDocs } from "@firebase/firestore";
import { setLazyProp } from "next/dist/server/api-utils";
import Register from "@/components/clubs/Register";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AdminMenu from "@/components/clubs/AdminMenu";
import Loading from "@/components/Loading";
import MemberName from "@/components/MemberName";
import Description from "@/components/clubs/Description";
import Tags from "@/components/clubs/Tags";
import Admins from "@/components/clubs/Admins";
import Links from "@/components/clubs/Links";
import IconPopout from "@/components/clubs/IconPopout";
import MemberApprovalToggle from "@/components/clubs/MemberApprovalToggle";

export default function Page({ params }: { params: { slug: string } }) {
  const [club, setClub] = useState<{
    name: string;
    logo: string;
    description: string;
    url: string;
    tags: any;
  }>({
    description: "",
    logo: "",
    name: "",
    tags: undefined,
    url: "",
  });
  const [loading, setLoading] = useState(true);
  const [clubNotFound, setClubNotFound] = useState(false);
  const [iconPopout, setIconPopout] = useState(false);
  const [clubId, setClubId] = useState();
  const [admins, setAdmins] = useState([]);
  const [adminIds, setAdminIds] = useState([]);
  const [isFaculty, setIsFaculty] = useState(false);
  const [uid, setUid] = useState();
  const [adminMenuOpened, setAdminMenuOpened] = useState(false);
  const [editedDescription, setEditedDescription] = useState<string>();
  const [loggedIn, setLoggedIn] = useState(false);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // @ts-ignore
      setUid(user.uid);
      setLoggedIn(true);
    }
    async function checkIfFaculty() {
      if (loggedIn) {
        // @ts-ignore
        const docSnap = await getDoc(doc(db, "users", user.uid));
        // @ts-ignore
        if (docSnap.data()["type"] == "faculty") {
          // console.log("faculty");
          setIsFaculty(true);
        }
      }
    }
    checkIfFaculty();
  });

  async function searchClubInfo() {
    const docSnap = await getDoc(doc(db, "clubs", params.slug));

    let hold: any = [];
    if (docSnap.exists()) {
      // @ts-ignore
      setClubId(docSnap.id);
      //   @ts-ignore
      setClub(docSnap.data());
      //   @ts-ignore
      setEditedDescription(club["description"]);
      setAdminIds(docSnap.data()["admins"]);
      setLoading(false);
    } else setClubNotFound(true);
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
    //   @ts-ignore
    setAdminIds(adminIdHold);
  }

  useEffect(() => {
    searchAdmins();
    searchClubInfo();
  }, [adminMenuOpened, loggedIn]);

  if (clubNotFound) {
    return (
      <section className={"flex justify-center my-10 flex-col"}>
        <h1 className={"text-center"}>Club Not Found!</h1>
        <p className={"text-center"}>
          Make sure the URL is typed correctly. Please contact THHS Hack Club if
          the problem persists.
        </p>
      </section>
    );
  }

  function handleIconChange(e: { preventDefault: () => void }) {
    e.preventDefault();
    setIconPopout(!iconPopout);
  }

  // @ts-ignore
  return (
    <section className={"relative"}>
      {iconPopout ? <IconPopout clubId={club["url"]} /> : ""}
      {loading ? (
        <Loading />
      ) : (
        <div
          className={
            "grid md:grid-cols-2 grid-cols-1 mx-8 md:mx-16 md:mt-6 xl:mx-48 gap-4 lg:gap-0"
          }
        >
          <div>
            <h1 className={"text-4xl text-center md:text-left"}>
              {club["name"]}
            </h1>
            <div className={"relative w-fit"}>
              <img
                className={"rounded-xl w-96 peer "}
                src={club["logo"]}
                alt={`${club["name"]} logo`}
              />
              {adminMenuOpened ? (
                <div
                  className={
                    "bg-accent peer-hover:block absolute top-0 hidden w-full h-full hover:block opacity-30"
                  }
                >
                  <button
                    onClick={handleIconChange}
                    className={"w-full h-full"}
                  >
                    Change Icon
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/*info*/}
          <div className={"mt-[2.5rem]"}>
            <Description
              adminMenuOpened={adminMenuOpened}
              desc={club["description"]}
              clubId={club["url"]}
            />

            <Links adminMenuOpened={adminMenuOpened} clubId={club["url"]} />

            <Admins
              admins={admins}
              adminMenuOpened={adminMenuOpened}
              clubId={club["url"]}
            />

            <Tags
              tagList={club["tags"]}
              // @ts-ignore
              clubId={club["url"]}
              adminMenuOpened={adminMenuOpened}
            />

            {adminMenuOpened ? (
              <MemberApprovalToggle clubId={club["url"]} />
            ) : (
              ""
            )}
          </div>

          <div>
            {/*//   @ts-ignore*/}
            {adminMenuOpened ? <AdminMenu faculty clubId={clubId} /> : ""}

            {!isFaculty ? (
              <>
                {loggedIn ? (
                  // @ts-ignore
                  <Register clubId={clubId} />
                ) : (
                  <p>Log in to register for clubs.</p>
                )}
              </>
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
            {/*//   @ts-ignore*/}
            {adminIds.indexOf(uid) !== -1 ? (
              <button
                onClick={() => {
                  setAdminMenuOpened(!adminMenuOpened);
                }}
                className={"border-2 p-2"}
              >
                Edit Club
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
