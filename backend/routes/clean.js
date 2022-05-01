import Express from "express";
import { Storage} from "@google-cloud/storage";

const clean = Express.Router();
const bucketname = "programmingforthecloud-340711.appspot.com";

const storage = new Storage({
   projectId: "programmingforthecloud-340711",
   keyFilename: "./key.json",
 });

clean.route("/").post( async (req,res) => {

   // Lists files in the bucket
  const [files] = await storage.bucket(bucketname).getFiles();
  console.log('Files:');

  files.forEach(file => {
     //file.metadata.timeCreated
   if(new Date(file.metadata.timeCreated) < Date.now() - (3600000)){
      console.log(file.name);
   }
 });
   
});


export default clean;