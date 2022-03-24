const DB_NAME = "duo-run-db";
const DB_VERSION = 1;
let db = null;

export function createDB() {
  let openRequest = indexedDB.open(DB_NAME, DB_VERSION);
  openRequest.onupgradeneeded = (e) => {
    db = e.target.result;

    // create tables here
    db.createObjectStore("exercises", { keyPath: "id" });
  };

  openRequest.onerror = function () {
    console.error("Error", openRequest.error);
  };

  openRequest.onsuccess = (e) => {
    db = e.target.result;
  };
}

createDB();

export async function deleteExercise(exercise) {
  // let db = await getDb();

  return new Promise((resolve) => {
    let trans = db.transaction(["exercises"], "readwrite");
    trans.oncomplete = () => {
      resolve();
    };

    let store = trans.objectStore("exercises");
    store.delete(exercise.id);
  });
}

export function getExercises(callback) {
  const tx = db.transaction("exercises", "readonly");
  const exerciseTable = tx.objectStore("exercises");
  const requestCursor = exerciseTable.getAll();
  requestCursor.onsuccess = (e) => {
    const cursor = e.target.result;
    callback.call(this, cursor);
  };
}

export async function saveExercise(exercise) {
  const tx = db.transaction("exercises", "readwrite");
  const exerciseTable = tx.objectStore("exercises");
  exerciseTable.add(exercise);
}
