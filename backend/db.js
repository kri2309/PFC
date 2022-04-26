import Firestore from "@google-cloud/firestore";
import { createHmac } from "crypto";

//Instantiating Firestore with project details
const db = new Firestore({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});

//Collection (Table)
//Document (Row)
//docRef selects the collection
export async function AddDocument(collection, data) {
  const docRef = db.collection(collection).doc();
  return await docRef.set(data);
}

export async function GetDocument(collection, valueType, value) {
  const docRef = db.collection(collection);
  const snapshot = await docRef.where(valueType, "==", value).get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
}


export async function CreateUser(email) {
  const docRef = db.collection("userData").doc();
  return await docRef.set({
    credits: 10,
    email: email,
    admin : false
  });
}

export async function GetUser(email) {
  const docRef = db.collection("userData");
  const snapshot = await docRef.where("email", "==", email).get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
}