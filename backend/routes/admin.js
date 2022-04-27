import Express from "express";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { validateToken } from "./auth.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const admin = Express.Router();

admin.route("/").get((req,res) => {
 res.sendFile(path.join(__dirname, "../../frontend/admin.html"));

});

export default admin;