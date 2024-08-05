import { Grid } from "gridjs-react";
import { html } from "gridjs";
import moment from "moment";
import { collection, doc, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { arrayUnion, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { useState, useEffect } from "react";
import { arrayRemove } from "@firebase/firestore/lite";

export default function MeetingGrid(props: {
  meetingList: { [x: string]: string }[];
  members: { [x: string]: string }[];
  clubId: string;
}) {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any[]>([]);

  let columns = ["Name"];
  props.meetingList.map((meeting: { [x: string]: string }) => {
    // @ts-ignore
    columns.push(
      html(
        `<a href='/clubs/${props.clubId}/${moment(meeting["date"]).format(
          "MMDDYY"
        )}'>${moment(meeting["date"]).format("MM/DD/YY")}</a>`
      )
    );
  });

  async function read(x: string) {
    const docSnap = await getDoc(doc(db, "users", x));
    return docSnap.data().name["fName"] + " " + docSnap.data().name["lName"];
  }

  useEffect(() => {
    async function fetchData() {
      let tempData: any[] = [];
      const memberNames = await Promise.all(
        props.members.map((member: { [x: string]: string }) =>
          read(member["uid"])
        )
      );

      props.members.map((member: { [x: string]: string }, i: number) => {
        tempData.push([memberNames[i]]);
        for (let m in props.meetingList) {
          tempData[i].push(
            html(
              `<input id=${
                moment(props.meetingList[m]["date"]).format("MMDDYY") +
                member["uid"]
              } type='checkbox' ${
                props.meetingList[m]["present"].indexOf(member["uid"]) > -1
                  ? "checked"
                  : ""
              } onclick='return false;' />`
            )
          );
        }
      });

      setData(tempData);
      setLoading(false);
    }

    fetchData();
  }, [props.members, props.meetingList]);

  if (loading) return <div>Loading...</div>;
  if (props.meetingList.length === 0) return <div>No meetings found.</div>;
  return (
    <>
      <Grid columns={columns} data={data} />
      {/*<button onClick={handleSubmit}>Submit</button>*/}
    </>
  );
}