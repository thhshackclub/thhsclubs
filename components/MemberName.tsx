import { collection, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { doc, getDoc, getDocs } from "@firebase/firestore";
import { useEffect, useState } from "react";
import moment from "moment";

export default function MemberName(props: {
  meetingId?: string;
  displayOnly?: boolean;
  uid: string;
  clubId?: string;
}) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function read() {
      const q = query(collection(db, "users"), where("uid", "==", props.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        setName(doc.data().name["fName"] + " " + doc.data().name["lName"]);
      });
    }
  });
  return <>{name}</>;
}
