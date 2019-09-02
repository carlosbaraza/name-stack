import * as firebase from "firebase/app";
import { isBrowser } from "./config";

if (!firebase.apps[0]) {
  // Initialize Firebase
  firebase.initializeApp(
    isBrowser ? (window as any).firebaseConfig : JSON.parse(process.env.FIREBASE_CLIENTSIDE_CONFIG)
  );
}

const DEFAULT_ERROR_MESSAGE =
  "Something went wrong. If the problem persists, please get in touch with us.";

export async function signIn(email, password) {
  // As httpOnly cookies are to be used, do not persist any state client side.
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

  // When the user signs in with email and password.
  const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
  const { user } = credential;

  // Get the user's ID token as it is needed to exchange for a session cookie.
  const idToken = await user.getIdToken();

  // Session login endpoint is queried and the session cookie is set.
  // CSRF protection should be taken into account.
  // ...
  // const csrfToken = getCookie('csrfToken')
  const response = await fetch("/api/v1/session", {
    credentials: "same-origin",
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken /*, csrfToken*/ })
  });

  if (response.status !== 201) {
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  // A page redirect would suffice as the persistence is set to NONE.
  await firebase.auth().signOut();
}
