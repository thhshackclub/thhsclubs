import { useEffect, useState } from "react";
import { collection, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { getDocs } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Page() {
  const [clubs, setClubs] = useState([]);

  const auth = getAuth();
  let uid: string;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
    }
  });

  useEffect(() => {
    async function read() {
      const querySnapshot = await getDocs(collection(db, "users", uid));
      setClubs(querySnapshot.data());
    }
  }, []);
  return (
    <div>
      <h1>My Clubs</h1>
    </div>
  );
}
