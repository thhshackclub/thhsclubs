import { useState } from "react";
import { updateDoc } from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { doc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

export default function IconPopout(props: { clubId: string }) {
  const [url, setNewUrl] = useState("");

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log("submit");
    updateDoc(doc(db, `clubs/${props.clubId}`), {
      logo: url,
    })
      .then(() => {
        toast.success("Icon updated!");
      })
      .catch((e) => {
        toast.error(`Something went wrong. Please try again \n ${e}`);
      });
  }

  return (
    <div className={"absolute right-1/2 translate-x-1/2 bg-bg p-2 rounded-md"}>
      <Toaster />
      <div className={"flex"}>
        <label>
          Set new icon URL
          <p>Must be in .jpg or .png format</p>
          <input
            type={"url"}
            value={url}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <button onClick={handleSubmit}>Save</button>
        </label>
      </div>
    </div>
  );
}
