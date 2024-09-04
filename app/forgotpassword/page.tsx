"use client";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [email, setEmail] = useState("");
  function handleForm(e: { preventDefault: () => void }) {
    e.preventDefault();
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        toast.success("Password reset email sent! Please check your email.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  return (
    <form className={"mx-8"} onSubmit={handleForm}>
      <h1 className={"text-center"}>Forgot Password</h1>
      <p className={"text-center"}>
        Enter the email associated with your account for a password reset.
      </p>
      <label className={"flex flex-col mx-auto md:grid mt-10 md:w-fit"}>
        <p>Email</p>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button type={"submit"}>Submit</button>
    </form>
  );
}
