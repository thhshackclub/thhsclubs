import { Grid } from "gridjs-react";
import { html } from "gridjs";
import moment from "moment";
import { collection, query, where } from "firebase/firestore";
import db from "@/firebase/firestore/firestore";
import { getDocs } from "@firebase/firestore";

export default function MeetingGrid(props) {
  let columns = ["Name"];
  props.meetingList.map((meeting: { [x: string]: string }) => {
    columns.push(moment(meeting["date"]).format("MM/DD/YY"));
  });

  async function read(x: string) {
    const q = query(collection(db, "users"), where("uid", "==", x));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      return doc.data().name["fName"] + " " + doc.data().name["lName"];
    });
  }

  let data = [];
  props.members.map((member: { [x: string]: string }, i: number) => {
    data.push([read(member["uid"])]);
    for (let m in props.meetingList) {
      data[i].push(
        // @ts-ignore
        html(
          `<input type='checkbox' ${
            props.meetingList[m]["present"].indexOf(member["uid"]) > -1
              ? "checked"
              : ""
          } />`
        )
      );
      console.log(props.meetingList[m]["present"].indexOf(member["uid"]));
      // if (props.meetingList[m]["present"].indexOf(member["uid"]) > -1) {
      //   data[i].push("present");
      // }
    }
  });
  return (
    <>
      <Grid columns={columns} data={data} />
      {/*{props.members}*/}
    </>
  );
}
