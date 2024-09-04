import { GitHub } from "react-feather";

export default function Footer() {
  return (
    <section
      className={
        "bg-bg w-screen absolute bottom-0 pt-4 pb-2 px-4 flex justify-between"
      }
    >
      <a
        className={"p-0 border-0 h-fit"}
        href={"https://github.com/thhshackclub/thhsclubs"}
      >
        <br />
        <GitHub className={"hover:text-gray-500"} />
      </a>

      <p className={"text-right"}>
<<<<<<< Updated upstream
        <p>Version 0.1.5</p>
=======
        <p>Version 0.2.1</p>
>>>>>>> Stashed changes
        Created and maintained by{" "}
        <a href={"https://instagram.com/thhs.hackclub"}>THHS Hack Club</a>.
      </p>
    </section>
  );
}
