import Express from "express";
import { Storage} from "@google-cloud/storage";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const bucketname = "programmingforthecloud-340711.appspot.com";


const storage = new Storage({
   projectId: "programmingforthecloud-340711",
   keyFilename: "./key.json",
 });
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clean = Express.Router();

clean.route("/").get( async (req,res) => {

   // Lists files in the bucket
  const [files] = await storage.bucket(bucketName).getFiles();
  console.log('Files:');

  files.forEach(file => {
     //file.metadata.timeCreated
   if(Date.now() - (3600000)> new Date(file.metadata.timeCreated)){
      console.log(file.name);
   }
 });
   
});


export default clean;