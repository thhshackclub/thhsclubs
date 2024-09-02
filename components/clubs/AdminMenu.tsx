import { Suspense, useEffect, useRef, useState } from "react";
import write from "@/firebase/firestore/write";
import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { addDoc, collection, query, where } from "firebase/firestore";
import MemberName from "@/components/MemberName";
import moment from "moment";
import { arrayRemove } from "@firebase/firestore/lite";
import { ChevronDown, ChevronUp, HelpCircle } from "react-feather";
import MeetingGrid from "@/components/clubs/MeetingGrid";
import { PlusSquare } from "react-feather";
import toast from "react-hot-toast";

export default function AdminMenu(props: {
  clubId: string;
  faculty?: boolean;
}) {
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingList, setMeetingList] = useState([]);
  const [members, setMembers] = useState([]);
  const dateInputRef = useRef(null);
  const [showMembers, setShowMembers] = useState(false);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log(document.getElementById(moment(meetingDate).format("MMDDYY")));
    if (document.getElementById(moment(meetingDate).format("MMDDYY")) == null) {
      await setDoc(
        doc(
          db,
          "clubs",
          props.clubId,
          "attendance",
          moment(meetingDate).format("MMDDYY")
        ),
        {
          date: meetingDate,
          present: [],
        }
      );
      getMeetingList();
      toast.success("Meeting added!");
    } else {
      toast.error("Meeting already exists");
    }
  }

  async function getMeetingList() {
    const docSnap = await getDocs(
      collection(db, "clubs", props.clubId, "attendance")
    );
    let hold: any = [];

    docSnap.forEach((doc) => {
      hold.push({
        date: doc.data()["date"],
        present: doc.data()["present"],
      });
    });
    setMeetingList(hold);

    hold = [];
  }

  async function getMembers() {
    const docSnap = await getDocs(
      collection(db, `clubs/${props.clubId}/members`)
    );

    let hold: any = [];
    docSnap.forEach((doc) => {
      hold.push({
        uid: doc.data()["uid"],
        role: doc.data()["role"],
        attendedMeetings: doc.data()["attendedMeetings"],
      });
      // console.log(doc.data());
    });
    setMembers(hold);
  }

  useEffect(() => {
    getMeetingList();
    getMembers();
  }, []);

  async function handleAttendanceSubmission(meeting: string) {
    for (let i in members) {
      if (document.getElementById(meeting + members[i]["uid"] + "true")) {
        await updateDoc(doc(db, "clubs", props.clubId, "attendance", meeting), {
          present: arrayUnion(members[i]["uid"]),
        });
      }
      if (document.getElementById(meeting + members[i]["uid"] + "false")) {
        // console.log(members[i]["uid"]);
        await updateDoc(doc(db, "clubs", props.clubId, "attendance", meeting), {
          present: arrayRemove(members[i]["uid"]),
        });
      }
    }
  }

  function totalMeetingsAttended(i: number) {
    if (
      Array.isArray(members[i]["attendedMeetings"]) &&
      // @ts-ignore
      members[i]["attendedMeetings"].length > 0
    ) {
      // @ts-ignore
      return members[i]["attendedMeetings"].length;
    } else {
      return 0;
    }
  }

  // @ts-ignore
  return (
    <section className={"md:w-screen mx-2 grid grid-cols-1 gap-6 mb-10"}>
      {/*<h1>Admin Menu</h1>*/}
      <h1>Meetings</h1>
      <form
        onSubmit={handleSubmit}
        className={"flex flex-col mx-auto md:mx-0 md:grid md:w-fit"}
      >
        <h2 className={""}>Add meeting date</h2>
        <div className={"flex justify-center md:justify-left"}>
          <input
            type={"date"}
            ref={dateInputRef}
            onChange={(e) => {
              setMeetingDate(e.target.value);
            }}
          />
          <button className={"border-0 my-auto no-bg p-0"}>
            <PlusSquare className={"hover:stroke-primary"} />
          </button>
        </div>
      </form>
      <div className={"flex flex-col"}>
        <h2 className={""}>Meeting List</h2>
        <MeetingGrid
          meetingList={meetingList}
          members={members}
          clubId={props.clubId}
        />
      </div>

      <div>
        <div className={"flex justify-center md:justify-start"}>
          <h1 className={"inline"}>Members</h1>
          <button
            className={"border-0 p-0 no-bg"}
            onClick={() => setShowMembers(!showMembers)}
          >
            {showMembers ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        <ul>
          {showMembers
            ? members.map((member, i) => (
                <li key={i}>
                  <MemberName
                    displayOnly={true}
                    clubId={props.clubId}
                    uid={member["uid"]}
                    key={i}
                  />{" "}
                  ({totalMeetingsAttended(i)})
                </li>
              ))
            : ""}
        </ul>
      </div>
    </section>
  );
}
