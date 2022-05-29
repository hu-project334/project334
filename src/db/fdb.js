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
  query,
  where,
  getDoc,
} from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmQhTuTywz-0SzS3ap66NYlQqt459CJy4",
  authDomain: "project334-3d839.firebaseapp.com",
  databaseURL: "https://project334-3d839-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project334-3d839",
  storageBucket: "project334-3d839.appspot.com",
  messagingSenderId: "290669961377",
  appId: "1:290669961377:web:352d8cfb5f270eced650e0",
  measurementId: "G-MXJHSMN169"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();




export async function createPatient() {
  const newPatient = await addDoc(collection(db, "patients"), { //Create new document with auto generated ID
    voornaam:"Dogukan",
    achternaam:"Cali",
    gewicht:60,
    geboortedatum:new Date("Mei 20, 1999"),
    lengte:1.78,
    geslacht:"Man",
    fysiotherapeut:"Jaap Jansen"
  });
}

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