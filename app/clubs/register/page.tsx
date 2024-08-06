"use client";
import React, { useState } from "react";
import write from "@/firebase/firestore/write";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getLoggedIn from "@/components/getLoggedIn";
import tagList from "@/components/tags";
import Select from "react-select";
import { addDoc, collection, doc } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { setDoc } from "@firebase/firestore";

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
  const auth = getAuth();
  let uid: string;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      setIsSignedIn(true);
    }
  });

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // console.log(name, description, logo);
    if (url == "register") {
      alert(`Invalid URL. Club URL cannot be "${url}".`);
      return;
    }
    await setDoc(doc(db, "clubs", url), {
      name: name.trim(),
      description: description,
      logo: logo,
      tags: tags,
      url: url,
      admins: [uid],
    }).then((err) => {
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
  }

  if (isSignedIn) {
    return (
      <section>
        <h1>Register a Club</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            <p>Club Name</p>
            <input
              required
              type="text"
              name="clubName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Club Name"
            />
          </label>
          <label htmlFor="description">
            <p>Club Description</p>
            <input
              required
              type="text"
              name="clubDescription"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="Club Description"
            />
          </label>
          <label htmlFor="logo">
            <p>Logo URL</p>
            <input
              required
              type="url"
              value={logo}
              onChange={(e) => {
                setLogo(e.target.value);
              }}
              placeholder="Logo URL"
            />
          </label>

          <label htmlFor={"tags"}>
            <p>Tags</p>
            <Select
              isMulti
              isSearchable
              isClearable
              isOptionDisabled={() => tags.length >= 4}
              options={tagList}
              onChange={(e) => setTags(e)}
            />
            <p>Select up to 4.</p>
          </label>
          <label htmlFor="description">
            <p>Club URL</p>
            thhsclubs.com/
            <input
              required
              type="text"
              name="clubDescription"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              placeholder="Club URL"
            />
          </label>

          <button type="submit">Register</button>
        </form>
      </section>
    );
  } else return <h1>You must sign in to register a club!</h1>;
}
