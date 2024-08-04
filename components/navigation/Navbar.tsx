"use client";
import { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "react-feather";
import MemberName from "@/components/MemberName";
import { usePathname } from "next/navigation";
import { Simulate } from "react-dom/test-utils";
import drop = Simulate.drop;
import signout from "@/firebase/auth/signout";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropDown = useRef();

  const useOutsideAlerter = (dropDown: any) => {
    useEffect(() => {
      function handleClickOutside(event: { target: any }) {
        if (dropDown.current && !dropDown.current.contains(event.target))
          setProfileDropdown(false);
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [dropDown]);
  };
  useOutsideAlerter(dropDown);

  // redirect if logged in
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      // @ts-ignore
      setUser(user.uid);
      setLoading(false);
    } else {
      // User is signed out
      // ...
    }
  });

  function handleLogOut(e: { preventDefault: () => void }) {
    e.preventDefault();
    signout();
  }

  const pathname = usePathname();
  if (pathname !== "/") {
    return (
      <section className={"w-screen bg-green-200 flex justify-between px-20"}>
        <p className={"font-black text-xl"}>THHS Clubs</p>
        <a href={"/clubs"}>Discover</a>
        <a href={"/myclubs"}>My Clubs</a>
        {/*@ts-ignore*/}
        <div className={"flex gap-2"} ref={dropDown}>
          <button
            className={"border-0 p-0"}
            onClick={() => setProfileDropdown(!profileDropdown)}
          >
            <User />
          </button>
          {profileDropdown ? (
            <div className={"absolute top-7 border-2 flex flex-col"}>
              <a>{loading ? "" : <MemberName displayOnly uid={user} />}</a>
              <button onClick={handleLogOut}>Log Out</button>
            </div>
          ) : (
            ""
          )}
          {/*<span>{loading ? "" : user}</span>*/}
          {/*<span>{loading ? "" : <MemberName displayOnly uid={user} />}</span>*/}
        </div>
      </section>
    );
  } else return "";
}
