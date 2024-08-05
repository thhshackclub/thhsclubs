import Tags from "@/components/clubs/Tags";

export default function ClubCard(props: { clubs: [] }) {
  return (
    <section className={"grid gap-4 grid-cols-3"}>
      {props.clubs.map((club, i) => (
        <a key={i} href={`/clubs/${club["url"]}`}>
          <div
            key={club["id"]}
            className="border-2 border-black rounded-2xl p-2"
          >
            <h2>{club["name"]}</h2>
            <img
              src={club["logo"]}
              alt={`${club["name"]} Logo`}
              className={"w-64 mx-auto rounded-3xl"}
            />
            <div className={"line-clamp-3"}>
              <p className={""}>{club["description"]}</p>
            </div>
            <div>
              <Tags tagList={club["tags"]} />
            </div>
          </div>
        </a>
      ))}
    </section>
  );
}
