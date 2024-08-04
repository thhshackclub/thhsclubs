"use client";
import moment from "moment";
import { arrayUnion, doc, getDoc, updateDoc } from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import QRCode from "react-qr-code";

export default function Page({
  params,
}: {
  params: { slug: string; meeting: string };
}) {
  const [clubName, setClubName] = useState("");
  const [uid, setUid] = useState();
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);

  var parts = params.meeting.match(/.{1,2}/g);
  var new_value = parts.join("/");

  async function verifyDate() {
    const docSnap = await getDoc(
      doc(db, `clubs/${params.slug}/attendance`, params.meeting)
    );
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      setError(
        `There is no meeting for this club on this date. Please ensure the URL is correct, or contact THHS Hack Club for help.`
      );
    }
  }

  async function getClubName() {
    const docSnap = await getDoc(doc(db, "clubs", params.slug));
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
    alert("Attendance recorded!");
  }

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // @ts-ignore
      setUid(user.uid);
      setLoggedIn(true);
    } else setLoggedIn(false);
  });

  if (!loggedIn) {
    return (
      <p>You are not logged in. Please log in to record your attendance.</p>
    );
  }
  if (error) {
    return <p>{error}</p>;
  } else
    return (
      <div>
        <h1>
          {new_value} Attendance for {clubName}
        </h1>
        <p>
          Signed in as <span>{uid}</span>
        </p>

        <button onClick={handleSubmit}>I was here!</button>

        <div className={"flex justify-center"}>
          <QRCode
            value={`https://thhsclubs.com/${params.slug}/${params.meeting}`}
          />
        </div>
      </div>
    );
}
