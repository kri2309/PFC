import Express from "express";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = "924492803178-ga7q7qvqllu5ons0kn2iu7699a0udi0q.apps.googleusercontent.com";
const auth = Express.Router();
const client = new OAuth2Client(CLIENT_ID);

export default auth;

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
        //console.log(`${payload.name} has logged in.`); 
      } else {
        res.send({ status: "401" });
      }
    }).catch((error)=> {
      console.log("Token expired");
      res.send({ status: "401" });
    });;
});


export const validateToken = async (token) => {
  return await client.verifyIdToken({
    idToken: token,
    audience:CLIENT_ID,
  });
};