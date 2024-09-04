import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import db from "@/firebase/firestore/firestore";
import toast from "react-hot-toast";

export default function MemberApprovalToggle(props: { clubId: string }) {
  const [isChecked, setIsChecked] = useState(false);
  const [count, setCount] = useState(0);
  async function handleChange() {
    setCount(count + 1);
    if (count > 5) {
      toast.error(
        "You are doing this too much. Please wait a few seconds before trying again."
      );
      return;
    }
    if (count % 2 == 0) {
      setIsChecked(true);
      await updateDoc(doc(db, "clubs", props.clubId), {
        joinApproval: true,
      });
    } else {
      setIsChecked(false);
      await updateDoc(doc(db, "clubs", props.clubId), {
        joinApproval: false,
      });
    }
  }

  useEffect(() => {
    async function checkIfNeedApproval() {
      const docSnap = await getDoc(doc(db, "clubs", props.clubId));

      if (docSnap.data()["joinApproval"]) {
        setIsChecked(true);
      }
    }
    checkIfNeedApproval();
  }, []);

  return (
    <div>
      <div className={"flex justify-between"}>
        <h2>Manual Member Approval</h2>
        <div className={"flex"}>
          <input
            id={"memberApprovalTypeCheckbox"}
            type={"checkbox"}
            checked={isChecked}
            onChange={() => handleChange()}
          />
        </div>
      </div>
    </div>
  );
}
