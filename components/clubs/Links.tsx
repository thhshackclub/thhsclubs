import React, { useEffect, useState } from "react";
import { getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { collection, doc } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";

import LinkIconManager from "@/components/clubs/LinkIconManager";
import Select from "react-select";
import {
  Calendar,
  ExternalLink,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  ShoppingCart,
  Twitch,
  Youtube,
  Save,
  PlusSquare,
} from "react-feather";
import LinkInput from "@/components/clubs/LinkInput";

export default function Links(props: {
  clubId: string;
  adminMenuOpened: boolean;
}) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getLinks() {
    let hold: any[] = [];
    const docSnap = await getDocs(
      collection(db, `clubs/${props.clubId}/links`)
    );
    docSnap.forEach((doc) => {
      hold.push({
        url: doc.data()["url"],
        icon: doc.data()["icon"],
        description: doc.data()["description"],
        id: doc.id,
      });
    });
    // @ts-ignore
    setLinks(hold);
    setLoading(false);
  }

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <>
      {loading ? (
        ""
      ) : (
        <ul className={"grid grid-cols-1"}>
          {!props.adminMenuOpened ? (
            <>
              {links.map((link, i) => {
                return (
                  <li key={i} className={"flex"}>
                    <a
                      href={link["url"]}
                      target={"_blank"}
                      rel={"noreferrer"}
                      // className={"*hover:text-primary *hover:stroke-primary"}
                    >
                      <div className={"flex flex-row gap-2 group"}>
                        <LinkIconManager icon={link["icon"]} />
                        <p className={"group-hover:text-primary"}>
                          {link["description"]} ({link["url"]})
                        </p>
                      </div>
                    </a>
                  </li>
                );
              })}
            </>
          ) : (
            <>
              <h2 className={"mt-10"}>Edit Link</h2>
              {links.map((link, i) => {
                return (
                  <LinkInput
                    key={i}
                    num={i}
                    clubId={props.clubId}
                    initialURL={links[i]["url"]}
                    initialDescription={links[i]["description"]}
                    initialIcon={links[i]["icon"]}
                    linkId={links[i]["id"]}
                  />
                );
              })}
            </>
          )}
        </ul>
      )}
    </>
  );
}
