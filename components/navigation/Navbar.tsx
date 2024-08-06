"use client";
import { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "react-feather";
import MemberName from "@/components/MemberName";
import { usePathname } from "next/navigation";
import { Simulate } from "react-dom/test-utils";
import drop = Simulate.drop;
import signout from "@/firebase/auth/signout";
import MobileNavbar from "@/components/navigation/MobileNavbar";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropDown = useRef();
  const [isSignedIn, setIsSignedIn] = useState(false);

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
      setIsSignedIn(true);
      setLoading(false);
    } else {
      // User is signed out
      // ...
    }
  });

  function handleLogOut() {
    signout();
  }

  const pathname = usePathname();
  if (pathname !== "/") {
    return (
      <>
        {/*desktop nav*/}
        <section
          className={"w-screen bg-bg  justify-between px-20 md:flex hidden"}
        >
          {/*<p className={"font-black text-xl"}>THHS Clubs</p>*/}
          <a href={"/"}>
            <img src={"/logo.png"} alt={"THHS Clubs"} className={"w-20"} />
          </a>
          <a href={"/clubs"} className={"my-auto text-lg font-display"}>
            Discover
          </a>
          <a href={"/myclubs"} className={"my-auto text-lg font-display"}>
            My Clubs
          </a>
          {/*@ts-ignore*/}
          <div className={"flex gap-2"} ref={dropDown}>
            <button onClick={() => setProfileDropdown(!profileDropdown)}>
              <User className={"stroke-primary"} />
            </button>
            {profileDropdown ? (
              <>
                {isSignedIn ? (
                  <div
                    className={
                      "absolute top-20 px-3 py-6 mt-1 rounded-b-lg right-2 w-48 flex flex-col text-right bg-bg"
                    }
                  >
                    <p>
                      Logged in as{" "}
                      <span className={"text-primary"}>
                        {loading ? "" : <MemberName displayOnly uid={user} />}
                      </span>
                    </p>
                    <button className={"w-fit"} onClick={handleLogOut}>
                      <span
                        className={
                          "border-2 border-light bg-accent px-2 py-1 rounded-md text-right hover:text-primary"
                        }
                      >
                        Log Out
                      </span>
                    </button>
                  </div>
                ) : (
                  <div
                    className={
                      "absolute top-20 px-3 py-6 mt-1 rounded-b-lg right-2 w-48 flex flex-col text-center bg-bg"
                    }
                  >
                    <a className={"hover:text-accent"} href={"/signin"}>
                      Sign In
                    </a>
                    <a className={"hover:text-accent"} href={"/signup"}>
                      Sign Up
                    </a>
                  </div>
                )}
              </>
            ) : (
              ""
            )}
            {/*<span>{loading ? "" : user}</span>*/}
            {/*<span>{loading ? "" : <MemberName displayOnly uid={user} />}</span>*/}
          </div>
        </section>

        <MobileNavbar
          user={user}
          handleLogOut={(e) => {
            e.preventDefault();
            handleLogOut();
          }}
        />
      </>
    );
  } else return "";
}
