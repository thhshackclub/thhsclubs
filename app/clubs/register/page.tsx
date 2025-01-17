"use client";
import React, { useState } from "react";
import write from "@/firebase/firestore/write";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getLoggedIn from "@/components/getLoggedIn";
import tagList from "@/components/tags";
import Select from "react-select";
import { addDoc, collection, doc, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import {
  arrayRemove,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { Tooltip } from "react-tooltip";
import { HelpCircle } from "react-feather";

export default function Page() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(
    "https://markleisherproductions.com/wp-content/uploads/2021/01/logo-placeholder-png-2.png"
  );
  const [isSignedIn, setIsSignedIn] = useState(false);
  // const [type, setType] = useState("Club");
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [accessCode, setAccessCode] = React.useState("");

  const auth = getAuth();
  let uid: string;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      setIsSignedIn(true);
    }
  });

  async function checkDuplicate() {
    let containsDuplicate = false;
    const querySnapshot = await getDocs(collection(db, "clubs"));
    querySnapshot.forEach((doc) => {
      if (doc.id === url) {
        containsDuplicate = true;
      }
    });
    return containsDuplicate;
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // console.log(name, description, logo);
    if (url == "register") {
      alert(`Invalid URL. Club URL cannot be "${url}".`);
      return;
    } else {
      if (await checkDuplicate()) {
        return alert(`Invalid URL. Club URL "${url}" already exists.`);
      }
    }
    const codeQuery = await getDoc(doc(db, "accessCodes", "codes"));
    if (codeQuery.exists()) {
      const validCodes = codeQuery.data()["clubCreationCodes"];
      if (validCodes.indexOf(accessCode) === -1) {
        return alert("Error in creating your club. Access code is invalid.");
      } else {
        await updateDoc(doc(db, "accessCodes", "codes"), {
          clubCreationCodes: arrayRemove(accessCode),
        });
      }
    } else return alert("Error in creating your club. Please try again later.");

    await setDoc(doc(db, "clubs", url), {
      name: name.trim(),
      description: description,
      logo: logo,
      tags: tags,
      url: url,
      admins: [uid],
    }).then((err) => {
      // @ts-ignore
      if (err) {
        alert(err);
      } else alert("Club Registered");
    });
    await setDoc(doc(db, `clubs/${url}/members`, uid), {
      role: "admin",
      title: "Executive",
      uid: uid,
      attendedMeetings: [],
    });
    await addDoc(collection(db, `clubs/${url}/links`), {
      description: "Placeholder",
      icon: "externalLink",
      url: "https://google.com",
    });
  }

  if (isSignedIn) {
    // @ts-ignore
    return (
      <section>
        <h1>Register a Club</h1>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-6"}>
          <label
            htmlFor="name"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Club Name</p>
            <input
              required
              type="text"
              name="clubName"
              className={"rounded-md border-2 py-1 pl-1"}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Club Name"
            />
          </label>
          <label
            htmlFor="description"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Club Description</p>
            <input
              required
              type="text"
              name="clubDescription"
              className={"rounded-md border-2 py-1 pl-1"}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="Club Description"
            />
          </label>
          <label
            htmlFor="logo"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <div className={"flex"}>
              <p>Logo URL</p>
              <a
                data-tooltip-place={"top"}
                data-tooltip-id={"url"}
                data-tooltip-content={
                  "Must be in .jpg or .png format. We recommend uploading your image to imgur.com. Then, right clicking on your upload and press 'Copy image address'."
                }
              >
                <HelpCircle width={16} className={"ml-2"} />
              </a>
            </div>
            <Tooltip id={"url"} />
            <input
              required
              type="url"
              value={logo}
              className={"rounded-md border-2 py-1 pl-1"}
              onChange={(e) => {
                setLogo(e.target.value);
              }}
              placeholder="Logo URL"
            />
          </label>

          <label
            htmlFor={"tags"}
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Tags</p>

            <Select
              isMulti
              isSearchable
              isClearable
              isOptionDisabled={() => tags.length >= 4}
              options={tagList}
              // @ts-ignore
              onChange={(e) => setTags(e)}
            />
            <p>Select up to 4.</p>
          </label>
          <label
            htmlFor="description"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Club URL</p>{" "}
            <div className={"flex"}>
              <p className={"my-auto"}>thhshawktivities.org/</p>
              <input
                required
                type="text"
                name="clubDescription"
                className={"rounded-md border-2 py-1 pl-1"}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                placeholder="Club URL"
              />
            </div>
          </label>
          <label
            htmlFor="accessCode"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <div className={"flex"}>
              <p>Club Creation Code</p>
              <a
                data-tooltip-place={"top"}
                data-tooltip-id={"creationcode"}
                data-tooltip-content={
                  "This was given out during the first Club Presidents meeting. Please contact thhs.hackclub@gmail.com if you need help."
                }
              >
                <HelpCircle width={16} className={"ml-2"} />
              </a>
            </div>
            <Tooltip id={"creationcode"} />
            <input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              required
              name="accessCode"
              id="accessCode"
              placeholder="Access Code"
              className={"rounded-md border-2 py-1 pl-1"}
            />
          </label>

          <div className={"flex justify-center pt-12"}>
            <button
              className={
                "text-center w-fit mx-auto text-xl border-2 rounded-md p-2 hover:bg-accent hover:border-primary transition"
              }
              type="submit"
            >
              Register
            </button>
          </div>
        </form>
      </section>
    );
  } else return <h1>You must sign in to register a club!</h1>;
}
