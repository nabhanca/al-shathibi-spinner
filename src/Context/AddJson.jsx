import { collection, doc, writeBatch, addDoc } from "firebase/firestore";
import { db } from "../Firebase Folder/FirebaseConfig";
import { uloomquestion } from "../Context/Json";

/**
 * Import the ravis array.
 * @param {string} mode  –  "fixed" to use ravId as doc ID, "auto" for random Firestore IDs
 */
export async function importJson(mode = "fixed",database) {
  if (mode === "auto") {
    // Auto-generate document IDs
   await Promise.all(
  uloomquestion.map(r => addDoc(collection(db, database),r))
);

    console.log("✅ Ravis imported with auto‑generated IDs!");
    return;
  }

  // Use ravId as custom document ID
  const batch = writeBatch(db);
  const coll = collection(db, "candidates");

  ravis.forEach(r => {
    batch.set(doc(coll, r.ravId), { name: r.name });
  });

  await batch.commit();
  console.log("✅ Ravis imported with fixed IDs!");
}
