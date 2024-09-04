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
        toast.success("Icon updated! Refresh to see your changes.");
      })
      .catch((e) => {
        toast.error(`Something went wrong. Please try again \n ${e}`);
      });
  }

  return (
    <div
      className={
        "absolute z-30 right-1/2 translate-x-1/2 bg-bg p-2 rounded-md border-2 border-black"
      }
    >
      <Toaster />
      <div className={"flex"}>
        <label>
          Set new icon URL
          <p>Must be in .jpg or .png format</p>
          <p>
            {" "}
            We recommend uploading your image to{" "}
            <a href={"https://imgur.com"}>imgur</a> and right clicking on your
            upload, then pressing {`"Copy image address"`}.
          </p>
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
