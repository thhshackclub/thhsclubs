"use client";
import React from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { number } from "prop-types";

function SignUp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fName, setFName] = React.useState("");
  const [lName, setLName] = React.useState("");
  const [osis, setOsis] = React.useState(0);
  const [accountType, setAccountType] = React.useState("student");
  const [grade, setGrade] = React.useState(0);

  const router = useRouter();

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

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
      return alert(error);
    }

    // else successful
    console.log(result);
    return router.push("/admin");
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="mt-60 mb-30">Sign up</h1>
        <form onSubmit={handleForm} className="form">
          <label htmlFor="email">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              placeholder="password"
            />
          </label>
          <label htmlFor={"First Name"}>
            <p>First Name</p>
            <input
              onChange={(e) => setFName(e.target.value)}
              required
              name="fname"
              placeholder="fname"
            />
          </label>
          <label htmlFor={"Last Name"}>
            <p>Last Name</p>
            <input onChange={(e) => setLName(e.target.value)} required />
          </label>
          <label htmlFor={"osis"}>
            <p>OSIS Number/Student ID</p>
            <input onChange={(e) => setOsis(e.target.value)} required />
          </label>
          <label htmlFor={"Grade"}>
            <p>Grade</p>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
              {/*<option value={0}>Faculty</option>*/}
            </select>
          </label>
          {/*<label htmlFor={"account type"}>*/}
          {/*  <p>Account Type</p>*/}
          {/*  <select*/}
          {/*    value={accountType}*/}
          {/*    onChange={(e) => setAccountType(e.target.value)}*/}
          {/*  >*/}
          {/*    <option value={"student"}>Student</option>*/}
          {/*    /!*<option value={"executive"}>Club Executive</option>*!/*/}
          {/*    /!*<option value={"su"}>Student Union</option>*!/*/}
          {/*    /!*<option value={"faculty"}>Faculty</option>*!/*/}
          {/*  </select>*/}
          {/*</label>*/}
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
