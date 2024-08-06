import { Menu } from "react-feather";
import { MouseEventHandler, useEffect, useState } from "react";
import MemberName from "@/components/MemberName";
import { useScrollLock } from "@/components/useScrollLock";

export default function MobileNavbar(props: {
  user: string;
  handleLogOut: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lockScroll, unlockScroll } = useScrollLock();

  return (
    <section className={`${menuOpen ? "h-dvh" : "h-fit"} bg-bg relative `}>
      <div className={"w-screen md:hidden flex px-4 relative"}>
        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
            if (menuOpen) unlockScroll();
            else lockScroll();
          }}
          className={"z-30"}
        >
          <Menu />
        </button>
        <img src={"/logo.png"} alt={"THHS Clubs"} className={"w-20 z-30"} />
      </div>
      <section
        className={` w-screen z-20 pt-2 flex-col ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        <a href={"/clubs"} className={"text-center text-lg font-display"}>
          Discover
        </a>
        <a href={"/myclubs"} className={"text-center text-lg font-display"}>
          My Clubs
        </a>
        {props.user ? (
          <div className={"absolute bottom-0"}>
            <p className={"font-display text-primary text-center"}>
              Signed in as <MemberName displayOnly uid={props.user} />
            </p>
            <button
              className={"font-display text-primary text-center"}
              onClick={props.handleLogOut}
            >
              Log Out
            </button>
          </div>
        ) : (
          "Sign In"
        )}
      </section>
    </section>
  );
}
