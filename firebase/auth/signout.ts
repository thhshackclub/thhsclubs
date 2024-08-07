import { getAuth, signOut } from "firebase/auth";
import { redirect } from "next/navigation";

export default function signout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      location.replace("/");
    })
    .catch((error) => {
      // An error happened.
      alert("There was an error signing you out. Please try again.");
    });
}
