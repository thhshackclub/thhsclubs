import MemberName from "@/components/MemberName";
import { PlusSquare, Trash } from "react-feather";
import { useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  query,
  where,
} from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import {
  arrayUnion,
  getDocs,
  setDoc,
  updateDoc,
  arrayRemove,
} from "@firebase/firestore";
import { update } from "@firebase/database";
import AdminTitleInput from "@/app/clubs/[slug]/AdminTitleInput";

export default function Admins(props: {
  clubId: string;
  adminMenuOpened: boolean;
  admins: any[];
}) {
  const [newAdmin, setNewAdmin] = useState("");
  const [title, setTitle] = useState("");

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log("submit");
    const q = query(collection(db, "users"), where("OSIS", "==", newAdmin));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((d) => {
      setDoc(doc(db, `clubs/${props.clubId}/members`, d.id), {
        // @ts-ignore
        role: "admin",
        title: title,
        uid: d.id,
      });
      // @ts-ignore
      updateDoc(doc(db, `clubs/${props.clubId}`), {
        admins: arrayUnion(d.id),
      }).then(() => alert("Admin added! Please refresh to see your changes."));
    });
  }

  async function removeAdmin(uid: string) {
    await updateDoc(doc(db, `clubs/${props.clubId}/members/${uid}`), {
      title: deleteField(),
      role: "member",
    })
      .then(async () => {
        await updateDoc(doc(db, `clubs/${props.clubId}`), {
          admins: arrayRemove(uid.toString()),
        });
      })
      .then(() => {
        alert("Admin removed! Please refresh to see your changes.");
      })
      .catch((e) => {
        alert(e);
      });
  }

  return (
    <div className={"my-10"}>
      <h2>Executive Board</h2>

      {props.admins.map((adminId, i) => {
        return (
          <div key={i} className={"my-4"}>
            {props.adminMenuOpened ? (
              //   admin menu opened
              <li key={i} className={"grid grid-cols-1 md:flex gap-2"}>
                <p className={"text-xl flex"}>
                  <MemberName uid={adminId["uid"]} displayOnly />

                  {/*for small displays*/}
                  <button
                    className={"border-0 p-0 md:hidden "}
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        confirm("Are you sure you want to remove this admin?")
                      ) {
                        removeAdmin(adminId["uid"]);
                      }
                    }}
                  >
                    <Trash />
                  </button>
                </p>
                <AdminTitleInput
                  initialTitle={adminId["title"]}
                  clubId={props.clubId}
                  uid={adminId["uid"]}
                />
                {/*for md+ displays*/}
                <button
                  className={
                    "hover:text-primary flex border-0 p-0 hidden md:inline"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    removeAdmin(adminId["uid"]);
                  }}
                >
                  <Trash className={"hover:text-primary"} />
                </button>
              </li>
            ) : (
              //   admin menu not opened
              <li key={i} className={"flex items-baseline gap-2"}>
                <p className={"text-xl"}>
                  <MemberName uid={adminId["uid"]} displayOnly />
                </p>
                <span>{adminId["title"]}</span>
              </li>
            )}
          </div>
        );
      })}
      {props.adminMenuOpened ? (
        <div className={"border-t-2"}>
          <input
            placeholder={"OSIS Number"}
            type={"number"}
            value={newAdmin}
            onChange={(e) => setNewAdmin(e.target.value)}
          />
          <input
            placeholder={"Title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className={"border-0"} onClick={handleSubmit}>
            <PlusSquare />
          </button>
        </div>
      ) : null}
    </div>
  );
}
