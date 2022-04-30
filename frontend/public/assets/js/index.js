let signInButton = document.getElementById("signIn");
let signOutButton = document.getElementById("signOut");
let profile = document.getElementById("profile");
let signInContainer = document.getElementById("signInContainer");
let credits = document.getElementById("credits");
let user_name = "";
let adminPanel = document.getElementById("admin-container");
let accordion = document.getElementById("accordion");

const selectFile = () => {
  if (user_name) {
    uploadFile();
  } else {
    alert("Error: You need to login first!");
  }
};

const authenticateReq = async (token) => {
  const url = `https://kristinaborgolivier.me/auth?token=${token}`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  const status = response.data.status;

  if (status == 200) {
    user_name = response.data.name;
    const name = response.data.name;
    const email = response.data.email;
    const picture = response.data.picture;
    const expiry = response.data.expiry;
    profile.style.display = "inline";
    signInContainer.style.display = "none";
    accordion.style.display = "inline";

    document.getElementById("navbarDropdownMenuLink").innerHTML =
      `<img
    id="picture"
    src=""
    class="rounded-circle"
    style="margin-right: 5px"
    height="25"
    alt=""
    loading="lazy"
  />` + name;

    document.getElementById(
      "payments-container"
    ).innerHTML = `<a class="nav-link active" aria-current="page" href="/payments?token=${token}">Buy Credits</a>`;

    document.getElementById("picture").src = picture;
    document.cookie = `token=${token};expires=${expiry}`;
    console.log(`${name} signed in successfully.`);

    return email;
  }
  if (response.data.admin) {
  } else {
    profile.style.display = "none";
    signInContainer.style.display = "inline";
    return null;
  }
};

async function loadGoogleLogin() {
  let session = document.cookie;
  if (session && session.includes("token")) {
    authenticateReq(session.split("token=")[1].split(";")[0]);
  } else {
    profile.style.display = "none";
    signInContainer.style.display = "inline";
  }

  const signOut = () => {
    let auth2 = gapi.auth2.getAuthInstance();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    auth2
      .signOut()
      .then(() => {
        adminPanel = document.getElementById("admin-container");
        adminPanel.style.display = "none";
        document.getElementById("payments-container").innerHTML = " ";
        profile.style.display = "none";
        accordion.style.display = "none";
        signInContainer.style.display = "inline";
        console.log("User signed out.");
      })
      .catch((error) => alert(error));
  };

  signOutButton.addEventListener("click", () => signOut());

  gapi.load("auth2", () => {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    let auth2 = gapi.auth2.init({
      client_id:
        "924492803178-ga7q7qvqllu5ons0kn2iu7699a0udi0q.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
      scope: "profile",
    });

    auth2.attachClickHandler(
      signInButton,
      {},
      async function (googleUser) {
        console.log("hell0");

        const email = await authenticateReq(
          googleUser.getAuthResponse().id_token
        );
        console.log(email);

        if (email != null) {
          const url = "/login?email=" + email;
          const headers = {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
          };
          const response = await axios.post(url, headers);
          console.log(response.data.admin);
          adminPanel = document.getElementById("admin-container");
          if (response.data.admin == true) {
            console.log(response.data.admin);
            adminPanel.style.display = "inline";
          }
        }
      },
      function (error) {
        alert(
          "Error: " + JSON.parse(JSON.stringify(error, undefined, 2)).error
        );
      }
    );
  });
}

async function RunCredits() {
  const url = `/credits`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  console.log(`Runtime credits: ${response.data.credits}`);
  credits.innerHTML = "Credits:" + response.data.credits;
}

async function GetAdminInfo() {
  const url = `/admin`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  console.log(response.data.admin);
  adminPanel = document.getElementById("admin-container");
  if (Boolean(response.data.admin) == true) {
    adminPanel.style.display = "inline";
  } else {
    adminPanel.style.display = "none";
    console.log(response.data.admin);
  }
}
async function Add10Credits() {
  const url = `/credits`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  console.log(`Runtime credits: ${response.data.credits}`);
  response.data.credits = response.data.credits + 10;
  console.log(`Updated credits: ${response.data.credits}`);
}
async function Add20Credits() {}
async function Add30Credits() {}
/*
async function getcredits(){
  const email = await authenticateReq(googleUser.getAuthResponse().id_token);
  console.log(email);

  if(email != null){
  const url = "/login?email="+email;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url,headers);
  if (response.data.result === "exists") {
    console.log("Found email in database: " + email);
  } else {
    console.log("Account has been created for "+ email);
  }
  credits = document.getElementById("credits");
  credits.innerHTML = "Credits: "+response.data.credits;
  tempcred = response.data.credits;
  sessionStorage.setItem("credits", response.data.credits);
  console.log("SetItem in session: " + response.data.credits);
  }
}
var tempcred = 0;
$(document).ready(function(){
  credits = document.getElementById("credits");
  credits.innerHTML = "Credits: "+ sessionStorage.getItem("credits");
  console.log("GetItem in session: " + sessionStorage.getItem("credits"));
});
*/