import Express from "express";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { validateToken, UserInfo } from "./auth.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const payments = Express.Router();

payments.route("/").get((req,res) => {
   
    const token = req.query.token;
    UserInfo.Credits;
    validateToken(token)
    .then((ticket) => {
        if (ticket.getPayload().name !=null){
            res.sendFile(path.join(__dirname, "../../frontend/payments.html"));

        } else{
            res.redirect("/");
        }
    }).catch((error) => {
        console.log("Token expired");
        res.redirect("/");
   
    });
   
});

export default payments;