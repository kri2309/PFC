import Express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Storage } from "@google-cloud/storage";
import { PubSub } from "@google-cloud/pubsub";
import fs from "fs";
import { validateToken } from "./auth.js";
import Firestore from "@google-cloud/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const upload = Express.Router();
const bucketname = "programmingforthecloud-340711.appspot.com";
var email = "";
var ext = "";
var url = "";
var headers = null;

var publishId = 0;

const db = new Firestore({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});

const storage = new Storage({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});


const pubsub = new PubSub({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});

const subscription = pubsub.subscription("queue-sub-sub");

const storage = new Storage({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});

let imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function (req, file, callback) {
    ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".doc" &&
      ext !== ".docx"
    ) {
      return callback(new Error("Only images and docs are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2621441,
  },
});
const callback2 = (err, messageId) => {
  publishId = messageId;
  console.log("MsgId: " + messageId);
  if (err) {
    console.log(err);
  }
};

//pubsub and posting in the conversions
async function publishMessage(payload) {
  const dataBuffer = Buffer.from(JSON.stringify(payload), "utf8");
  await pubsub.topic("queue-sub").publish(dataBuffer, {}, callback2);
}

//Upload to the cloud storage
async function UploadCloud(folder , file) {
  return await storage.bucket(bucketname).upload(file.path, {
    destination: folder + file.originalname,
  });
}

//convert to base64
function base64convert(file) {
  return fs.readFileSync(file, "base64");
}

//send to pubsub 
upload.route("/").post(imageUpload.single("image"), async function (req, res) {
  const token = req.headers.cookie.split("token=")[1].split(";")[0];
  validateToken(token).then(async function (r) {
    email = r.getPayload().email;
    if (req.file) {
      UploadCloud("pending/", req.file)
        .catch(console.error)
        .then(async ([r]) =>{
          let base64Code = base64convert(req.file.path);
          publishMessage({
            convertedFile: base64Code,
            email: email,
            filename: req.file.originalname,
            url: r.metadata.mediaLink,
            date: new Date().toUTCString(),
          }).then(() => {
            res.send({
              status: "200",
              message: "File uploaded successfully! Processing..",
            });
          });
        });
    }
  });
});

export default upload;
