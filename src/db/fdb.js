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
} from "firebase/firestore";

const db = getFirestore();

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

export async function createPatient(
  id,
  name,
  surName,
  weight,
  dateOfBirth,
  heightInM,
  email,
  fysiotherapeutNummer
) {
  const patientsRef = collection(db, "patients");
  // where id is not id in patientID
  await setDoc(doc(patientsRef), {
    id: id,
    name: name,
    surName: surName,
    weight: weight,
    dateOfBirth: dateOfBirth,
    heightInM: heightInM,
    email: email,
    fysiotherapeutNummer: fysiotherapeutNummer,
  });
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
