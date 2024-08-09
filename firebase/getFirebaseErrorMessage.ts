export const getFirebaseErrorMessage = (code: any) => {
  let message = null;

  switch (code) {
    case "auth/user-not-found":
      message = "User doesn't exist.";

      break;

    case "auth/email-already-exists":
      message = "Email already exist";

      break;

    case "auth/invalid-credential":
      message =
        "Invalid Credentials. Check your email and password and try again.";

      break;

    case "auth/invalid-email":
      message = "Invalid Email";

      break;

    case "auth/invalid-password":
      message = "Incorrect Password";

      break;

    case "auth/too-many-requests":
      message =
        "You're entered the incorrect password too many times. Try again later.";

      break;

    default:
      message = "Something went wrong";

      break;
  }

  return message;
};
