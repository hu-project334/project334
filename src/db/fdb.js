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
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
const auth = getAuth(); // Wordt gebruikt in testPatient functie
import store from "../store/userStore";
import { getUnixOfToday } from "../controllers/unix.js";

const db = getFirestore();

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

export async function addPatient(
  name,
  weight,
  dateOfBirth,
  heightInM,
  email,
  gender,
  fysiotherapeutNummer
) {
  // voor het verkrijgen van de user id: https://stackoverflow.com/a/37901056

  try {
    // const docRef = doc(db, "fysio", user.uid);
    const colRef = collection(db, "patienten");
    setDoc(doc(colRef), {
      name: name,
      weight: weight,
      dateOfBirth: dateOfBirth,
      heightInM: heightInM,
      email: email,
      gender: gender,
      fysiotherapeutNummer: fysiotherapeutNummer,
    });
  } catch (error) {
    console.error("Error creating patient", error);
  }
}

export async function getSinglePatient(docKey) {
  const docRef = doc(db, "patienten", docKey);
  // const docRef = doc(db, "fysio", uid, "patienten", email);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function deletePatient(docKey) {
  // console.log(docKey);
  const docRef = doc(db, "patienten", docKey);
  await deleteDoc(docRef);
}

export async function addCategorie(docIdPatient, type) {
  // console.log(docIdPatient);
  const docRef = doc(db, "patienten", docIdPatient);
  const colRef = collection(docRef, "excersizeCategory");
  const map = new Map();
  setDoc(doc(colRef, type), {
    name: type,
    results: [],
  });
}

export async function addResultToCategory(docIdPatient, type, beweging, norm) {
  const docRef = doc(db, "patienten", docIdPatient);
  const colRef = collection(docRef, "excersizeCategory");
  const docRef2 = doc(colRef, type);

  await updateDoc(docRef2, {
    results: arrayUnion({ date: getUnixOfToday(), beweging, norm }),
  });
}

export async function getCategories(docIdPatient) {
  try {
    // console.log(docIdPatient);
    let map = new Map();
    const docRef = doc(db, "patienten", docIdPatient);
    const colRef = collection(docRef, "excersizeCategory");
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((doc) => {
      map.set(doc.data().name, doc.data().results);
    });
    // console.log(map);
    return map;
  } catch (error) {
    console.error("Error getting categories", error);
  }
}

export async function getCategoryResults(docIdPatient, excersizeCategory) {
  const docRef = doc(db, "patienten", docIdPatient);
  const colRef = collection(docRef, "excersizeCategory");
  const docRef2 = doc(colRef, excersizeCategory);

  const docSnap = await getDoc(docRef2);
  // console.log(docSnap.data().results);
  return docSnap.data();
}

export async function deleteCategory(docIdPatient, excersizeCategory) {
  const docRef = doc(db, "patienten", docIdPatient);
  const colRef = collection(docRef, "excersizeCategory");
  const docRef2 = doc(colRef, excersizeCategory);
  await deleteDoc(docRef2);
}

// https://firebase.google.com/docs/firestore/query-data/queries
export async function getPatients(uid) {
  const map = new Map();
  try {
    const colRef = collection(db, "patienten");
    const q = query(colRef, where("fysiotherapeutNummer", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      map.set(doc.id, doc.data());
    });
    return map;

    // return list;
  } catch (error) {
    console.error("Error getting objects from Firebase Database", error);
  }
}
