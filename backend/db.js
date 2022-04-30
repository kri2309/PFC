import Firestore from "@google-cloud/firestore";
import { createHmac } from "crypto";
import Redis from "redis";

export let redisClient = new Redis.createClient();

redisClient.on("error", function(error){
  console.error(error);
});

//change name
const GetNewCredit = async()=>{
  return redisClient.get("creditPrices");
}

const SetNewCredits = async(payload)=>{
  return await redisClient.set("credits", JSON.stringify(payload));
}

export async function SetNewCreditPrices(payload){
  if(!redisClient.isOpen){
    await redisClient.connect();
  }
  const res = await SetNewCredits(payload);

  return res;
}

export async function GetNewCreditPrices(payload){
  if(!redisClient.isOpen){
    await redisClient.connect();
  }
  const res = await GetNewCredit();

  return res;
}

var userCredits = 0;
var adminInfo = false;
var docID = "";
var docIDUser= "";
var latestDate = new Date();

//Instantiating Firestore with project details
const db = new Firestore({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});

//Collection (Table)
//Document (Row)
//docRef selects the collection
var docId = "";
export async function AddDocument(collection, data) {
  const docRef = db.collection(collection).doc();
  const docR = await docRef.set(data);
  docId = docR.id;
  return docR;
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
    docIDUser = doc.id;
    data.push(doc.data());
  });

  if(data.length > 0){
    userCredits = data[0].credits;
    adminInfo = data[0].admin;
    
  }
  return data;
}

export async function GetCredits(){
  return userCredits;
}

export async function SetCredits(email, number){
  const getdoc = await GetUser(email);
  console.log(`emai : ${email} + number: ${number}`);
  var Credits = Number(getdoc[0].credits)+ Number(number);
  const docRef = db.collection("userData").doc(docIDUser);
  const r = await docRef.update({
    credits: Number(Credits),
  });
  userCredits = Credits;
}

export async function GetAdminInfo(){
  return adminInfo;
}

export async function GetLatestDoc(email){
  const docRef = db.collection("conversions");
  const snapshot = await docRef.where("email", "==", email).get();
  snapshot.forEach((doc) => {
    if(latestDate == null || docID == ""){
      latestDate = doc.date;
      docID = doc.id;
    } 
    else if(doc.date < latestDate){
      latestDate = doc.date;
      docID = doc.id;
    }
  });
  return docID;
}
