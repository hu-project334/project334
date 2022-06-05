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



const db = getFirestore();



//////////////////////////////////////
import { getAuth } from "firebase/auth";
const auth = getAuth(); // Wordt gebruikt in testPatient functie



export async function addPatient(){
  // voor het verkrijgen van de user id: https://stackoverflow.com/a/37901056
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const docRef = doc(db, "fysio", user.uid);
      const colRef = collection(docRef, "patienten")
    
      addDoc(colRef, {
        id: 2,
        name: "Milo",
        surName: "Belien",
        weight: 70,
        dateOfBirth: "28-09-2002",
        heightInM: 1.83,
        email: "milo.belien@student.hu.nl",
        fysiotherapeutNummer: user.uid,
      });
    } else {
      // No user is signed in.
    }
  });
}
///////////////////////////////////




// dummy data
async function dummyDataPatients(patientsRef, uid) {
  // await setDoc(doc(patientsRef), {
  //   id: 1,
  //   name: "Alexander",
  //   surName: "de Graaff",
  //   weight: 70,
  //   dateOfBirth: "22-06-2002",
  //   heightInM: 1.82,
  //   email: "alexander.d.graaff@gmail.com",
  //   fysiotherapeutNummer: uid,
  // });
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

// https://firebase.google.com/docs/firestore/query-data/queries
export async function getPatients(uid) {
  // https://fireship.io/snippets/firestore-increment-tips/

  // const patientsRef = collection(db, "patients");
  // dummyDataPatients(patientsRef, uid);

  const q = query(
    collection(db, "patients"),
    where("fysiotherapeutNummer", "==", uid)
  );
  let patientList = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // console.log(doc.id);

    // documentID  =doc.id   user= doc.data()
    //  user.id = documentID
    // console.log(doc.id, " => ", doc.data());

    patientList.push(doc.data());
    // console.log(doc.id, " => ", doc.data());
  });
  return patientList;
}

// logged in fysio
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

export async function createPatient(
  name,
  weight,
  dateOfBirth,
  heightInM,
  email,
  gender,
  fysiotherapeutNummer
) {
  try {
    const patientsRef = doc(db, "fysio", fysiotherapeutNummer, "patients");

    await setDoc(doc(patientsRef), {
      id: id,
      name: name,
      weight: weight,
      dateOfBirth: dateOfBirth,
      heightInM: heightInM,
      email: email,
      gender: gender,
      fysiotherapeutNummer: fysiotherapeutNummer,
    });
  } catch {
    console.error("Error writing new message to Firebase Database", error);
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

export async function getPatient() {
  const patientRef = collection("patients").where();
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
