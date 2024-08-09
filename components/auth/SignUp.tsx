"use client";
import React from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { number } from "prop-types";
import { collection, deleteDoc, doc, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { arrayRemove, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

function SignUp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fName, setFName] = React.useState("");
  const [lName, setLName] = React.useState("");
  const [osis, setOsis] = React.useState<number>();
  const [accountType, setAccountType] = React.useState("student");
  const [grade, setGrade] = React.useState(0);
  const [accessCode, setAccessCode] = React.useState("");

  const router = useRouter();

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // @ts-ignore
    if (osis.toString().length !== 9) {
      toast.error(
        "Error in creating your account. OSIS number must be 9 digits long."
      );
      return;
    }

    const codeQuery = await getDoc(doc(db, "accessCodes", "codes"));
    if (codeQuery.exists()) {
      const validCodes = codeQuery.data()["validCodes"];
      if (validCodes.indexOf(accessCode) === -1) {
        return toast.error(
          "Error in creating your account. Access code is invalid."
        );
      } else {
        await updateDoc(doc(db, "accessCodes", "codes"), {
          validCodes: arrayRemove(accessCode),
        });
      }
    } else
      return toast.error(
        "Error in creating your account. Please try again later."
      );

    const { result, error } = await signUp(
      email,
      password,
      fName,
      lName,
      osis,
      accountType,
      grade
    );

    if (error) {
      return toast.error(error);
    }

    // else successful
    // console.log(result);

    return router.push("/clubs");
  };

  return (
    <div className="wrapper">
      <Toaster />
      <div className="form-wrapper">
        <h1 className="text-center my-6">Sign Up</h1>
        <form onSubmit={handleForm} className="form px-4 flex flex-col gap-4">
          <label
            htmlFor="email"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className={"rounded-md border-2 py-1 pl-1"}
            />
          </label>
          <label
            htmlFor="password"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              placeholder="Password"
              className={"rounded-md border-2 py-1 pl-1"}
            />
          </label>
          <label
            htmlFor={"First Name"}
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>First Name</p>
            <input
              className={"rounded-md border-2 py-1 pl-1"}
              onChange={(e) => setFName(e.target.value)}
              required
              name="fname"
              placeholder="First Name"
            />
          </label>
          <label
            htmlFor={"Last Name"}
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Last Name</p>
            <input
              className={"rounded-md border-2 py-1 pl-1"}
              onChange={(e) => setLName(e.target.value)}
              required
              placeholder={"Last Name"}
            />
          </label>
          <label
            htmlFor={"osis"}
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>OSIS Number/Student ID</p>
            <input
              className={"rounded-md border-2 py-1 pl-1"}
              onChange={(e) => {
                // @ts-ignore
                setOsis(e.target.value);
                // @ts-ignore
                if (osis > 1000000000) {
                  // @ts-ignore
                  setOsis(parseInt(osis.toString().slice(0, 9)));
                }
              }}
              maxLength={9}
              required
              value={osis}
              type={"number"}
              placeholder={"OSIS Number"}
            />
          </label>
          <label
            htmlFor={"Grade"}
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Grade</p>
            {/*//   @ts-ignore*/}
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
            </select>
          </label>
          <label
            htmlFor="accessCode"
            className={"flex flex-col mx-auto md:grid md:w-fit"}
          >
            <p>Access Code</p>
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

          <button
            type="submit"
            className={
              "font-display p-2 border-2 rounded-md w-fit mx-auto bg-accent"
            }
          >
            Sign Up
          </button>
        </form>
        <p className={"text-center mt-4"}>
          Already have an account?{" "}
          <a href={"/signin"} className={"text-primary"}>
            Log in here
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default SignUp;
