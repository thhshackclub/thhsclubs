import Select from "react-select";
import {
  Calendar,
  ExternalLink,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Save,
  ShoppingCart,
  Twitch,
  Youtube,
} from "react-feather";
import React, { useState } from "react";
import { updateDoc } from "@firebase/firestore";
import { collection, doc } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";

const iconList = [
  { label: <Globe />, value: "globe" },
  { label: <Instagram />, value: "instagram" },
  { label: <Calendar />, value: "calendar" },
  { label: <ExternalLink />, value: "externalLink" },
  { label: <Linkedin />, value: "linkedin" },
  { label: <Mail />, value: "mail" },
  { label: <ShoppingCart />, value: "shoppingCart" },
  { label: <Twitch />, value: "twitch" },
  { label: <Youtube />, value: "youtube" },
];

export default function LinkInput(props: {
  initialIcon: string;
  clubId: string;
  num: number;
  linkId: string;
  initialDescription: string;
  initialURL: string;
}) {
  const [newDescription, setNewDescription] = useState(
    props.initialDescription
  );
  const [newURL, setNewURL] = useState(props.initialURL);
  const [newIcon, setNewIcon] = useState(
    iconList.find((e) => e.value === props.initialIcon)
  );

  async function handleSubmit() {
    console.log(props.linkId);
    await updateDoc(doc(db, `clubs/${props.clubId}/links/${props.linkId}`), {
      description: newDescription,
      url: newURL,
      icon: newIcon,
    })
      .then(() => alert("Link updated!"))
      .catch((error) => alert("Error updating link: " + error));
  }

  return (
    <div className={"grid "}>
      <label className={""}>
        <span className={""}>Icon: </span>
        <Select
          isClearable
          options={iconList}
          defaultValue={newIcon}
          // @ts-ignore
          onChange={(e) => setNewIcon(e["value"])}
        />
      </label>
      <label>
        Description:{" "}
        <input
          onChange={(e) => setNewDescription(e.target.value)}
          value={newDescription}
        />
      </label>
      <label>
        URL:{" "}
        <input onChange={(e) => setNewURL(e.target.value)} value={newURL} />
      </label>
      <button
        className={
          "mt-1 text-center w-fit text-xl border-2 p-2 rounded-md hover:bg-accent hover:border-primary transition"
        }
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        Save
      </button>
    </div>
  );
}
