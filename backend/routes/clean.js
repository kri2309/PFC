import Express from "express";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { validateToken, UserInfo } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clean = Express.Router();

clean.route("/").get((req,res) => {
   
   console.log("hello cron job");

   
});


export default clean;