import { useEffect, useState } from "react";
import { doc, updateDoc } from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import moment from "moment/moment";
import toast from "react-hot-toast";

export default function Description(props: {
  clubId: string;
  desc: string;
  adminMenuOpened: boolean;
}) {
  const [editedDescription, setEditedDescription] = useState(props.desc);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    await updateDoc(doc(db, "clubs", props.clubId), {
      description: editedDescription,
    })
      .then(() => toast.success("Description updated!"))
      .catch((error) => toast.error("Error updating description: " + error));
  }

  // reset descripion when closed
  useEffect(() => {
    setEditedDescription(props.desc);
  }, []);

  if (props.adminMenuOpened) {
    return (
      <div className={"flex flex-col"}>
        <h2>Edit Description</h2>
        <textarea
          rows={3}
          className={"text-lg w-full"}
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
        />
        <button
          className={
            "mt-1 w-fit text-center text-xl border-2 p-2 rounded-md hover:bg-accent hover:border-primary transition"
          }
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  } else
    return <p className={"text-lg text-center md:text-left"}>{props.desc}</p>;
}
