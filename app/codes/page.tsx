"use client";
import db from "@/firebase/firestore/firestore";
import { writeBatch, doc } from "firebase/firestore";
import { useEffect } from "react";

export default function Page() {
  function makeid(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async function setCodes(data: []) {
    // Get a new write batch
    const batch = writeBatch(db);

    // Update the population of 'SF'
    const sfRef = doc(db, "accessCodes", "codes");
    batch.update(sfRef, { clubCreationCodes: data });

    // Commit the batch
    await batch.commit();
  }

  useEffect(() => {
    let hold = [];
    for (let i = 0; i < 100; i++) {
      hold.push(makeid(6));
    }
    setCodes(hold).then((r) => alert("done"));
  }, []);

  return <></>;
}
