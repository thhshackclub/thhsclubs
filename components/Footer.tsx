import { GitHub } from "react-feather";

export default function Footer() {
  return (
    <section
      className={
        "bg-green-200 w-screen absolute bottom-0 pt-4 pb-2 px-4 flex justify-between"
      }
    >
      <a
        className={"p-0 border-0"}
        href={"https://github.com/thhshackclub/thhsclubs"}
      >
        <GitHub className={"hover:text-gray-500"} />
      </a>
      <p className={"text-right"}>Created and managed by THHS Hack Club.</p>
    </section>
  );
}
