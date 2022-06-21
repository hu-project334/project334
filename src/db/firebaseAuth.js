import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import store from "../store/userStore.js";
import router from "../router/index.js";
import { createFysio } from "./fdb";

export async function registerWithEmail(value) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, value.email, value.password)
    .then((userCredential) => {
      let user = userCredential.user;
      store.commit("setUser", user);
      createFysio("", user.email, user.uid);
      router.push({ path: "/patients" });

      return null;
    })
    .catch((error) => {
      console.log(error.code);
      return error.code;
    });
}

export async function login(value) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, value.email, value.password)
    .then((userCredential) => {
      const user = userCredential.user;
      store.commit("setUser", user);
      createFysio("", user.email, user.uid);
      router.push({ path: "/patients" });

      return { succes: true, errorMessage: "" };
    })

    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          return { succes: false, error: "Invalid email" };
        case "auth/user-not-found":
          return {
            succes: false,
            error: "No account with that email was found",
          };
        case "auth/wrong-password":
          return { succes: false, error: "Incorrect password" };
        default:
          return {
            succes: false,
            error: "Email or password was incorrect",
          };
      }
    });
}
export async function RegisterWithGoogle() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      createFysio(user.displayName, user.email, user.uid);

      // getPatients(user.uid);

      store.commit("setUser", user);
      router.push({ path: "/patients" });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
    });
}

export async function logOut() {
  const auth = getAuth();
  return signOut(auth)
    .then(() => {
      store.dispatch("logOutUser");
      router.push({ path: "/" });
    })
    .catch((error) => {
      console.log(error);
    });
}
