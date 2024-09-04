"use client";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { collection } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MemberName from "@/components/MemberName";
import toast from "react-hot-toast";

export default function Page({ params }: { params: { slug: string } }) {
  const [admins, setAdmins] = useState([]);
  const [uid, setUid] = useState();
  const [clubName, setClubName] = useState("");
  const [clubNotFound, setClubNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joinQueue, setJoinQueue] = useState([]);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // @ts-ignore
      setUid(user.uid);
    }
  });

  async function searchClubInfo() {
    const docSnap = await getDoc(doc(db, "clubs", params.slug));

    let hold: any = [];
    if (docSnap.exists()) {
      setClubName(docSnap.data()["name"]);
      setJoinQueue(docSnap.data()["joinQueue"]);
      setLoading(false);
    } else setClubNotFound(true);
  }

  async function searchAdmins() {
    const docSnap = await getDocs(
      collection(db, `clubs/${params.slug}/members`)
    );

    let adminIdHold: string[] = [];
    docSnap.forEach((doc) => {
      if (doc.data().role === "admin") {
        adminIdHold.push(doc.data()["uid"]);
      }
    });

    setAdmins(adminIdHold);
    //   @ts-ignore
  }

  useEffect(() => {
    searchClubInfo();
    searchAdmins();
  }, []);

  async function updateMemberStatus(uid: string, approved: boolean) {
    setJoinQueue((l) => l.filter((item) => item !== uid));
    await updateDoc(doc(db, `clubs/${params.slug}`), {
      joinQueue: arrayRemove(uid),
    });
    if (approved) {
      await setDoc(doc(db, `clubs/${params.slug}/members/${uid}`), {
        uid: uid,
        role: "member",
        attendedMeetings: [],
      });
      toast.success("Member approved.");
    } else toast.success("Member denied.");
  }
  async function denyMember(uid: string) {}

  return (
    <div>
      {admins.indexOf(uid) !== -1 ? (
        <div>
          <h1>Join Requests for {clubName}</h1>
          <ul>
            {joinQueue.map((uid, i) => (
              <li key={i}>
                <MemberName uid={uid} />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    updateMemberStatus(uid, true);
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    updateMemberStatus(uid, false);
                  }}
                >
                  Deny
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>You are not an admin of this club.</>
      )}
    </div>
  );
}
