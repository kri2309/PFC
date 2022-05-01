const Firestore = require("@google-cloud/firestore");
const Storage = require("@google-cloud/storage");
const fs = require("fs");
const axios = require('axios');

var email = "";
var ext = "";
var url = "";
var headers = null;

const db = new Firestore({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});

const storage = new Storage({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});
const bucketname = "programmingforthecloud-340711.appspot.com";

let docref = "";
const AddDocument = async (collection, data) => {
  const docRef = db.collection(collection).doc();
  docref = docRef;
  return await docRef.set(data);
};

const FileToAPI = async (filename, convertedFile) => {
  ext = path.extname(filename);
  if (ext == ".png" || ext == ".jpg" || ext == ".gif" || ext == ".jpeg") {
    //Send to PDF Conversion API
    url = `https://getoutpdf.com/api/convert/image-to-pdf`;
    headers = {
      //"Content-Type": "application/json",
      api_key:
        "ed4129c1077bfcfbe13885c696190a477b0ac821e09371b7076b2454cdb35c83",
      image: `${convertedFile}`,
    };
  }

  if (ext !== ".doc" || ext !== ".docx") {
    //Send to PDF Conversion API
    url = `https://getoutpdf.com/api/convert/document-to-pdf`;
    headers = {
      //"Content-Type": "application/json",
      api_key:
        "ed4129c1077bfcfbe13885c696190a477b0ac821e09371b7076b2454cdb35c83",
      image: `${convertedFile}`,
    };
  }

  const response = await axios.post(url, headers);

  return response.data.pdf_base64;
};

var NewName = "";
const NewPDFFile = async (filename, response) => {
  const newfile = new Buffer.from(response, "base64");
  console.log(newfile);
  //change the file name
  NewName = filename.replace(path.extname(filename), ".pdf");
  return newfile;
};

var FinalLink = "";
const PostToCompletedBucket = async (newfile, NewName) => {
  await storage
    .bucket(bucketname)
    .file(`completed/${NewName}`)
    .save(newfile)
    .then(async function (r) {
      //getting the completed link
      FinalLink =
        "https://storage.googleapis.com/programmingforthecloud-340711.appspot.com/completed/" +
        NewName;
    });
    return FinalLink;
};

const PostToConversions = async (FinalLink) => {
  const doc = db.collection("conversions").doc(docref);
  const res = await doc.update({
    completed: FinalLink,
  });
  console.log("File converted successfully!");
}

//entry point of our application
exports.helloPubSub = async function (event, context) {
  const data = Buffer.from(event.data, "base64").toString();
  const jsonData = JSON.parse(data);
  console.log(
    `File ${jsonData.filename} with url ${jsonData.url} uploaded to cloud storage by ${jsonData.email} on ${jsonData.date}`
  );
  //Adding a document to the database
  await AddDocument("conversions", {
    email: jsonData.email,
    filename: jsonData.filename,
    date: jsonData.date,
    pending: jsonData.url,
    completed: "",
  });

  FileToAPI(filename, convertedFile).then((response) => {
    NewPDFFile(filename, response).then((r) => {
      PostToCompletedBucket(r, NewName).then((link) =>{
        PostToConversions(link);
      });
    });
  });
};
