"use client";
import moment from "moment";
import { arrayUnion, doc, getDoc, updateDoc } from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import QRCode from "react-qr-code";
import MemberName from "@/components/MemberName";

export default function Page({
  params,
}: {
  params: { slug: string; meeting: string };
}) {
  const [clubName, setClubName] = useState("");
  const [uid, setUid] = useState();
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);

  var parts = params.meeting.match(/.{1,2}/g);
  // @ts-ignore
  var new_value = parts.join("/");

  async function verifyDate() {
    const docSnap = await getDoc(
      doc(db, `clubs/${params.slug}/attendance`, params.meeting)
    );
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      if (docSnap.data()["present"].includes(uid)) {
        // @ts-ignore
        setError("You have already recorded your attendance for this meeting.");
      }
      if (moment(new_value).diff(moment(), "days") > 2) {
        // @ts-ignore
        setError("The attendance window has closed for this meeting.");
      }
    } else {
      setError(
        //   @ts-ignore
        `There is no meeting for this club on this date. Please ensure the URL is correct, or contact THHS Hack Club for help.`
      );
    }
  }

  async function getClubName() {
    const docSnap = await getDoc(doc(db, "clubs", params.slug));
    // @ts-ignore
    setClubName(docSnap.data()["name"]);
  }

  useEffect(() => {
    verifyDate();
    getClubName();
  });

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    await updateDoc(
      doc(db, "clubs", params.slug, "attendance", params.meeting),
      {
        present: arrayUnion(uid),
      }
    );
    // @ts-ignore
    await updateDoc(doc(db, "clubs", params.slug, "members", uid), {
      attendedMeetings: arrayUnion(params.meeting),
    });
    alert("Attendance recorded!");
  }

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // @ts-ignore
      setUid(user.uid);
      setLoggedIn(true);
      setLoading(false);
    } else setLoggedIn(false);
  });

  if (!loggedIn) {
    return (
      <p>You are not logged in. Please log in to record your attendance.</p>
    );
  }
  if (error) {
    return <p>{error}</p>;
  } else {
    // @ts-ignore
    return (
      <div className={"flex justify-center flex-col gap-6 pt-6 pb-32"}>
        <h1 className={"text-center"}>
          {new_value} Attendance for {clubName}
        </h1>
        <div className={"flex justify-center flex-col"}>
          <p className={"text-center"}>
            {/*//   @ts-ignore*/}
            Signed in as {loading ? "" : <MemberName uid={uid} displayOnly />}
          </p>

          <button
            className={"border-2 px-2 py-1 mx-auto w-fit"}
            onClick={handleSubmit}
          >
            <span> I was here! </span>
          </button>
        </div>

        <section>
          <h2 className={"text-center"}>Share the Attendance!</h2>
          <div className={"flex justify-center"}>
            <QRCode
              value={`https://thhsclubs.vercel.app/${params.slug}/${params.meeting}`}
            />
          </div>
        </section>
      </div>
    );
  }
}
