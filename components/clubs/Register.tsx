import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { useEffect, useRef, useState } from "react";
import getLoggedIn from "@/components/getLoggedIn";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import MemberName from "@/components/MemberName";
import toast from "react-hot-toast";

export default function Register(props: { clubId: string }) {
  const [registered, setRegistered] = useState(false);
  const [approvalRequired, setApprovalRequired] = useState(false);

  const auth = getAuth();
  let uid: string;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
    }
  });

  useEffect(() => {
    async function check() {
      const docSnap = await getDocs(
        collection(db, `clubs/${props.clubId}/members`)
      );
      docSnap.forEach((doc) => {
        if (doc.data()["uid"] === uid) {
          setRegistered(true);
        }
      });
    }
    async function checkIfNeedApproval() {
      const docSnap = await getDoc(doc(db, "clubs", props.clubId));
      console.log(docSnap.data().joinApproval);
      if (docSnap.data()["joinApproval"]) {
        setApprovalRequired(true);
      }
    }
    checkIfNeedApproval();
    check();
  }, []);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (approvalRequired) {
      await updateDoc(doc(db, `clubs/${props.clubId}`), {
        joinQueue: arrayUnion(uid),
      });
      toast.success(
        "You have submitted your request to join this club. Please check back soon."
      );
    } else {
      await setDoc(doc(db, `clubs/${props.clubId}/members/${uid}`), {
        uid: uid,
        role: "member",
        // name: <MemberName uid={uid} displayOnly={true} />,
        attendedMeetings: [],
      })
        .then(() => {
          setRegistered(true);
          toast.success("Registered!");
        })
        .catch((e) => {
          toast.error(e);
        });
    }
  }

  return (
    <>
      {registered ? (
        <span className={"md:block inline"}>
          You are a member of this club.
        </span>
      ) : (
        <button onClick={handleSubmit} className={"border-2 p-2 bg-amber-300"}>
          Register
        </button>
      )}
    </>
  );
}
