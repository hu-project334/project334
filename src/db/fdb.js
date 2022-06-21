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
  console.log(docKey);
  const docRef = doc(db, "patienten", docKey);
  await deleteDoc(docRef);
}

export async function addCategorie(docIdPatient, type) {
  console.log(docIdPatient);
  const docRef = doc(db, "patienten", docIdPatient);
  const colRef = collection(docRef, "excersizeCategory");
  const map = new Map();
  setDoc(doc(colRef, type), {
    name: type,
    results: {
      200322: { beweging: 170, norm: 3 },
      210322: { beweging: 60, norm: 98 },
      220322: { beweging: 30, norm: 50 },
      310522: { beweging: 30, norm: 50 },
    },
  });
}

export async function getCategories(docIdPatient) {
  try {
    console.log(docIdPatient);
    const map = new Map();
    const docRef = doc(db, "patienten", docIdPatient);
    const colRef = collection(docRef, "excersizeCategory");
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      map.set(doc.id, doc.data());
    });
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
  console.log(docSnap.data());
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
