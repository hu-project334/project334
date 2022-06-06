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

    // console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

// https://firebase.google.com/docs/firestore/manage-data/delete-data
export async function deletePatient(id) {
  const patientRef = doc(db, "patients", id);
  console.log(id);

  // // db.collection("patients").document(id).delete();
  // await deleteDoc(patientRef);
  // // console.log("does this work");
  await deleteDoc(patientRef);
  console.log("werkt dit wel of niet");

  // const handleDelete = async (id) => {
  //   const taskDocRef = doc(db, "tasks", id);
  //   try {
  //     await deleteDoc(taskDocRef);
  //   } catch (err) {
  //     alert(err);
  //   }
  // };
}

export async function getPatient() {}

/**--------------------------- OUDE CODE VOOR REFERENTIE --------------------------- */
/** 
// users
export async function createUser(uid) {
  await addDoc(collection(db, "users"), {
    uid,
  });
}

// exercises
export async function updateExerciseScheme(
  schemeId,
  exercises,
  name,
  description
) {
  const docRef = await doc(db, "execise-scheme", schemeId);
  updateDoc(docRef, {
    name,
    exercises,
    description,
    public: true,
  });
}
export async function deleteExerciseScheme(schemeId) {
  const docRef = doc(db, "execise-scheme", schemeId);
  deleteDoc(docRef);
}

export async function createExerciseScheme(name, exercises, description) {
  await addDoc(collection(db, "execise-scheme"), {
    name,
    exercises,
    description,
    public: true,
  });
}
export async function getMyExercises() {
  const docRef = await getDocs(collection(db, "execise-scheme"));

  return docRef.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
}

// patients
*/
