import Express from "express";
import cors from "cors";
import https from "https";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { GetUser, CreateUser} from "./db.js";
import auth from "./routes/auth.js";
import upload from "./routes/upload.js";
import home from "./routes/home.js";
import payments from "./routes/payments.js";

const DEV = false;
const PORT = DEV ? 80 : 443;
const SECRET_MANAGER_CERT =
  "projects/924492803178/secrets/PublicKey/versions/latest";
const SECRET_MANAGER_PK =
  "projects/924492803178/secrets/PrivateKey/versions/latest";
const SECRET_MANAGER_GET_OUT_PDF =
  "projects/924492803178/secrets/GetOutPDF/versions/latest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sm = new SecretManagerServiceClient({
  projectId: "programmingforthecloud-340711",
  keyFilename: "./key.json",
});

export let PDF_API_KEY = "";

const startServer = async () => {
  //Load GetOutPDF API Key
  const [pdf] = await sm.accessSecretVersion({
    name: SECRET_MANAGER_GET_OUT_PDF,
  });
  PDF_API_KEY = pdf.payload.data.toString();
  if (!DEV) {
    const [pub] = await sm.accessSecretVersion({
      name: SECRET_MANAGER_CERT,
    });

    const [prvt] = await sm.accessSecretVersion({
      name: SECRET_MANAGER_PK,
    });

    const sslOptions = {
      key: prvt.payload.data.toString(),
      cert: pub.payload.data.toString(),
    };

    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log("Secure Server Listening on port:" + PORT);
    });
  } else {
    app.listen(PORT, () => console.log("Server Listening on port: " + PORT));
  }
};

const app = Express();
//enabled http -> https redirection
if (!DEV) {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    req.secure ? next() : res.redirect("https://" + req.headers.host + req.url);
  });
}
//serve static files
app.use(Express.static(path.join(__dirname, "../frontend/public")));

//allow cross-origin reqs
app.use(cors());

//route auth traffic to auth.js
app.use("/auth", auth);

//route upload traffic to upload.js
app.use("/upload", upload);

app.use("/home", home);

app.use("/payments", payments);

//Delivering index.html;
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.post("/login",  async function(req, res) {
  const email = req.query.email;
  console.log("recieved email getting user");

  GetUser(email).then( async function(response){
    if(response.length > 0){
      console.log("found user");
      res.send({ result: "exists", reason: "Found email", credits: response[0].credits, admin: response[0].admin});

    }
    else{
      const r = await CreateUser(email);
      res.send({ result: "created", reason: "Created email", credits:10, admin: false});
    }
  });
});

startServer();