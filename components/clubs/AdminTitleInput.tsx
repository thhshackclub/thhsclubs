import { useState } from "react";
import { Save } from "react-feather";
import { doc, updateDoc } from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { arrayRemove } from "@firebase/firestore/lite";
import toast, { Toaster } from "react-hot-toast";

export default function AdminTitleInput(props: {
  initialTitle: string;
  clubId: string;
  uid: string;
}) {
  const [title, setTitle] = useState(props.initialTitle);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // console.log("submit");
    await updateDoc(doc(db, "clubs", props.clubId, "members", props.uid), {
      title: title,
    })
      .then(() => toast.success("Title updated!"))
      .catch((e) => alert(e));
  }

  return (
    <div className={"flex"}>
      <input
        className={"border-2 rounded-l"}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        required
      />
      <button onClick={handleSubmit} className={"no-bg border-0 p-0"}>
        <Save className={"hover:stroke-primary"} />
      </button>
    </div>
  );
}
