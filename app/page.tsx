"use client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { redirect } from "next/navigation";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) setLoggedIn(true);
  });

  if (!loggedIn) {
    return (
      <main className="m-10">
        <h1 className={"text-7xl"}>
          THHS
          <br />
          Clubs
        </h1>
        <p>Townsend Harris's database for all things extracurricular.</p>
        <div className={"flex gap-2 mt-10"}>
          <a href={"/signup"}>Sign Up</a>
          <a href={"/signin"}>Login</a>
        </div>
      </main>
    );
  } else redirect("/clubs");
}
