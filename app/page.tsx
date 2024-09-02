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
      <main className="h-dvh ">
        <div className={"flex justify-center py-10"}>
          <h1 className={"text-7xl"}>
            THHS
            <br />
            Hawktivities
          </h1>
          <img src={"/logo.png"} alt={"THHS Clubs"} className={"h-36"} />
        </div>
        <p className={"text-center text-lg"}>
          Townsend Harris High School{`\'`}s database for all things
          extracurricular.
        </p>
        <div
          className={
            "px-6 grid md:mx-24 lg:mx-36 xl:mx-64 2xl:mx-80 grid-cols-2 gap-2 justify-center mt-10"
          }
        >
          <a
            href={"/signup"}
            className={
              "text-center text-xl mt-1 w-full border-2 p-2 rounded-md bg-accent hover:border-primary transition shadow-2xl"
            }
          >
            Sign Up
          </a>{" "}
          <a
            href={"/signin"}
            className={
              "text-center text-xl mt-1 w-full border-2 p-2 rounded-md bg-accent hover:border-primary transition shadow-2xl"
            }
          >
            Login
          </a>
        </div>
        {/*<div className={"flex justify-center mt-20 flex-col"}>*/}
        {/*  <p className={"text-center"}>No time?</p>*/}
        {/*  <a*/}
        {/*    href={"/clubs"}*/}
        {/*    className={*/}
        {/*      "text-center w-fit mx-auto text-xl border-2 rounded-md p-2 hover:bg-accent hover:border-primary transition"*/}
        {/*    }*/}
        {/*  >*/}
        {/*    Browse now*/}
        {/*  </a>*/}
        {/*</div>*/}
      </main>
    );
  } else redirect("/clubs");
}
