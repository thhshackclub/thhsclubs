"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

export default function Profile() {
  const { user } = useAuthContext();
  const router = useRouter();

  React.useEffect(() => {
    if (user == null) router.push("/");
  }, [user]);

  return (
    <section>
      <h1>Profile</h1>
      <p>
        Logged in as {user.displayName} (UID: {user.uid})
      </p>
      {/*<ul>*/}
      {/*  {Object.keys(user).map((u) => {*/}
      {/*    return <li>{u}</li>;*/}
      {/*  })}*/}
      {/*</ul>*/}
    </section>
  );
}
