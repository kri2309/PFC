import Express from "express";
import { OAuth2Client } from "google-auth-library";
import { GetUser , CreateUser} from "../db.js";

const CLIENT_ID = "924492803178-ga7q7qvqllu5ons0kn2iu7699a0udi0q.apps.googleusercontent.com";
const auth = Express.Router();
const client = new OAuth2Client(CLIENT_ID);

//Making a UserInfo to pass info from backend to frontend
export let UserInfo = {
  Email: "",
  Admin: false,
  Credits: 0
};

export function getUserInfo(){
  return UserInfo;
}

export default auth;


//checking google token
auth.route("/").post((req, res) => {
  const token = req.query.token;
  validateToken(token)
    .then((ticket) => {
      if (ticket) {
        const payload = ticket.getPayload();
          res.send({
            status: "200",
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            token: token,
            expiry: payload.exp,
          }); 
      } else {
        res.send({ status: "401" });
      }
    }).catch((error)=> {
      console.log("Token expired");
      res.send({ status: "401" });
    });;
});

//useless but am too scared to remove :) 
async function checkLogin(email,credits,admin){
let data = await GetUser(email)
if (data === undefined){
  CreateUser(email,credits,admin);
  data = await GetUser(email)
}
else{
  UserInfo.Email = data.email;
  UserInfo.Credits = data.credits;
  UserInfo.Admin = data.admin;
}
return data;
}

//token
export const validateToken = async (token) => {
  return await client.verifyIdToken({
    idToken: token,
    audience:CLIENT_ID,
  });
};