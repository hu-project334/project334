/** ------------ Dit is tijdelijk om de functionaliteit te testen binnen nodeJS */
import promptSync from 'prompt-sync';
const prompt = promptSync();
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






export async function addExercises(){

}


/**--------------------------- FUNCTIONS --------------------------- */
export async function createPatient() {
  const voornaam = prompt("Voornaam:");
  const achternaam = prompt("Achternaam:");
  const patientnummer = prompt("Patientnummer:");
  const gewicht = 60
  const geboortedatum = new Date("Mei, 20, 1969");
  const lengte = 1.78;
  const geslacht = "Man";
  const fysiotherapeut = "Jaap Jansen";


  const newPatient = await setDoc(doc(db, "patients", patientnummer), {
    voornaam:voornaam,
    achternaam:achternaam,
    gewicht:gewicht,
    geboortedatum:geboortedatum,
    lengte:lengte,
    geslacht:geslacht,
    fysiotherapeut:fysiotherapeut,
    patientnummer:patientnummer
  })
  .then(()=>{
    console.log("Data added successfully");
  })
  .catch((error)=>{
    console.log("Unsuccessful operation, error:"+ error);
  })

  const newPatientresults = await setDoc(doc(db, "patients", patientnummer, "resultaten"),{
    testwaarde:"test"


  })
}




export async function getPatient(){
  const patientnummer = prompt("Welke patient document wilt u inzien? (Patientnummer)");
  var ref = doc(db, "patients", patientnummer);
  const docSnap = await getDoc(ref);

  if (docSnap.exists()){
    console.log("Voornaam: ", docSnap.data().voornaam);
    console.log("Achternaam: ", docSnap.data().achternaam);
    console.log("Gewicht: ", docSnap.data().gewicht);
    console.log("Geboortedatum: ", docSnap.data().geboortedatum);
    console.log("Lengte: ", docSnap.data().lengte);
    console.log("Geslacht: ", docSnap.data().geslacht);
    console.log("Fysiotherapeut: ", docSnap.data().fysiotherapeut);
    console.log("Patientnummer: ", docSnap.data().patientnummer);

  } else{
    console.log("No such document");
  }
}




export async function deletePatient(){
  const patientnummer = prompt("Welke patient document wilt u verwijderen? (Patientnummer)");
  var ref = doc(db, "patients", patientnummer)
  const docSnap = await getDoc(ref);

  if(!docSnap.exists()){
    console.log("Document does not exist");
    return;

  }

  await deleteDoc(ref)
  .then(() => {
    console.log("Patient is succesvol verwijderd");
  }) 
  .catch((error) => {
    console.log("Patient kon niet worden verwijderd:"+error);
  })
}
















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