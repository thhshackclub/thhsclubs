import { PlusSquare } from "react-feather";
import Select from "react-select";
import tagList from "@/components/tags";
import React, { useState } from "react";
import { doc, updateDoc } from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import toast from "react-hot-toast";
export default function Tags(props: {
  clubId: string;
  tagList: any[];
  adminMenuOpened?: boolean;
}) {
  const [tags, setTags] = useState([]);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    await updateDoc(doc(db, "clubs", props.clubId), {
      tags: tags,
    })
      .then(() => toast.success("Tags updated!"))
      .catch((error) => toast.error("Error updating tag: " + error));
  }

  if (!props.adminMenuOpened) {
    return (
      <div className={""}>
        {props.tagList.map((tag, i: number) => {
          return (
            <p
              key={i}
              className={
                "rounded-3xl drop-shadow-md bg-accent inline-block w-fit px-4 py-1 my-1 mx-0.5"
              }
            >
              {tag["label"]}
            </p>
          );
        })}
      </div>
    );
  } else
    return (
      <div>
        <div className={"inline"}>
          <h2>Edit Tags</h2>
          <Select
            isMulti
            isSearchable
            isClearable
            isOptionDisabled={() => tags.length >= 4}
            options={tagList}
            defaultValue={props.tagList}
            //   @ts-ignore
            onChange={(e) => setTags(e)}
          />
          <p>Select up to 4.</p>
          <button className={"border-2 p-2 w-fit"} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    );
}
