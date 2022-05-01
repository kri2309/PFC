import Express from "express";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { validateToken, UserInfo } from "./auth.js";


const storage = new Storage({
    projectId: "programmingforthecloud-340711",
    keyFilename: "./key.json",
  });


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const payments = Express.Router();

payments.route("/").get((req,res) => {
   
    const token = req.query.token;
    UserInfo.Credits;
    res.sendFile(path.join(__dirname, "../../frontend/payments.html"));

   
});


export default payments;