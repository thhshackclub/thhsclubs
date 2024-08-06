"use client";
import React from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from "next/navigation";

function SignIn() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();

    const { result, error } = await signIn(email, password);

    if (error) {
      return console.log(error);
    }

    // else successful
    // console.log(result);
    return router.push("/clubs");
  };
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="text-center my-6">Sign In</h1>
        <form onSubmit={handleForm} className="form px-4 flex flex-col gap-4">
          <label
            htmlFor="email"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Email</p>
            <input
              className={"rounded-md border-2 py-1 pl-1"}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label
            htmlFor="password"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>
              Password{" "}
              <span className={"text-primary"}>
                <a href={"/forgotpassword"}>Forgot password?</a>
              </span>
            </p>
            <input
              className={"rounded-md border-2 py-1 pl-1"}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
          </label>
          <button
            type="submit"
            className={
              "font-display mt-2 p-2 border-2 rounded-md w-fit mx-auto bg-accent"
            }
          >
            Sign In
          </button>
        </form>
        <p className={"text-center mt-4"}>
          First time?{" "}
          <a href={"/signup"} className={"text-primary"}>
            Create an account
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default SignIn;
