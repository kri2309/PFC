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
     //2 days old gets deleted
   if(new Date(file.metadata.timeCreated) < Date.now() - (172800000)){
      console.log("deleted : "+file.name);
      file.delete();
   }
 });
   
});


export default clean;