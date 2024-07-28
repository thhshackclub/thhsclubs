"use client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { redirect } from "next/navigation";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logInForm, setLogInForm] = useState(false);
  const [signUpForm, setSignUpForm] = useState(false);

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
        <p>Townsend's database for all things extracurricular.</p>
        <div className={"flex gap-2 mt-10"}>
          <button
            onClick={() => {
              setSignUpForm(!signUpForm);
              setLogInForm(false);
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setLogInForm(!logInForm);
              setSignUpForm(false);
            }}
          >
            Login
          </button>
        </div>
        <div>{logInForm ? <SignIn /> : ""}</div>
        <div>{signUpForm ? <SignUp /> : ""}</div>
      </main>
    );
  } else redirect("/clubs");
}
