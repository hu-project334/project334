/** ------------ Dit is tijdelijk om de functionaliteit te testen binnen nodeJS */
// import promptSync from "prompt-sync";
// const prompt = promptSync();
/** ------------ Dit is tijdelijk om de functionaliteit te testen binnen nodeJS */

/** IMPORTS */
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  where,
  getDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
const auth = getAuth(); // Wordt gebruikt in testPatient functie
import store from "../store/userStore";

const db = getFirestore();

// dummy data
async function dummyDataPatients(patientsRef, uid) {
  await setDoc(doc(patientsRef), {
    id: 2,
    name: "Milo",
    surName: "Belien",
    weight: 70,
    dateOfBirth: "28-09-2002",
    heightInM: 1.83,
    email: "milo.belien@student.hu.nl",
    fysiotherapeutNummer: uid,
  });
}

/**--------------------------- FUNCTIONS --------------------------- */

export async function createFysio(name, email, uid) {
  // https://stackoverflow.com/questions/49682327/how-to-update-a-single-firebase-firestore-document
  try {
    const fysioRef = collection(db, "fysio");

    await setDoc(doc(fysioRef, uid), {
      userID: uid,
      name: name,
      email: email,
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}
// https://firebase.google.com/docs/firestore/query-data/queries
export async function getPatients(uid) {
  console.log("komt die hier");
  let patientList = [];
  const docRef = doc(db, "fysio", uid);
  const colRef = collection(docRef, "patienten");
  const querySnapshot = await getDocs(colRef);
  querySnapshot.forEach((doc) => {
    patientList.push(doc.data());
  });
  console.log(patientList);
  return patientList;
}

export async function addPatient(
  name,
  weight,
  dateOfBirth,
  heightInM,
  email,
  gender
) {
  // voor het verkrijgen van de user id: https://stackoverflow.com/a/37901056
  auth.onAuthStateChanged(function (user) {
    if (user) {
      const docRef = doc(db, "fysio", user.uid);
      const colRef = collection(docRef, "patienten");
      setDoc(doc(colRef, email), {
        name: name,
        weight: weight,
        dateOfBirth: dateOfBirth,
        heightInM: heightInM,
        email: email,
        gender: gender,
        fysiotherapeutNummer: user.uid,
      });
    } else {
      console.log("no user is signed in");
      // No user is signed in.
    }
  });
}

export async function getSinglePatient(email, uid) {
  const docRef = doc(db, "fysio", uid, "patienten", email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

// https://firebase.google.com/docs/firestore/manage-data/delete-data
// Yes, the document you've mentioned is updated.
// And no, deleting a document in Firestore does not delete its subcollections.
// While deleting the document in Cloud Firestore, the subcollections won't be deleted automatically. You have to delete them manually instead.
export async function deletePatient(email, uid) {
  const docRef = doc(db, "fysio", uid, "patienten", email);
  const docSnap = await deleteDoc(docRef);
}
