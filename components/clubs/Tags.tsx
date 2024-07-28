import { PlusSquare } from "react-feather";
import Select from "react-select";
import tagList from "@/components/tags";
import React, { useState } from "react";
import { doc, updateDoc } from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
export default function Tags(props: {
  tagList: any[];
  adminMenuOpened: boolean;
}) {
  const [tags, setTags] = useState([]);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    await updateDoc(doc(db, "clubs", props.clubId), {
      tags: tags,
    })
      .then(() => alert("Tags updated!"))
      .catch((error) => alert("Error updating tag: " + error));
  }

  if (!props.adminMenuOpened) {
    return (
      <div>
        {props.tagList.map((tag, i: number) => {
          return (
            <p
              key={i}
              className={
                "rounded-3xl border-2 bg-yellow-200 inline-block w-fit px-4 py-1"
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
          <Select
            isMulti
            isSearchable
            isClearable
            isOptionDisabled={() => tags.length >= 4}
            options={tagList}
            defaultValue={props.tagList}
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
