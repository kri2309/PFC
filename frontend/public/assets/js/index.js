let signInButton = document.getElementById("signIn");
let signOutButton = document.getElementById("signOut");
let profile = document.getElementById("profile");
let signInContainer = document.getElementById("signInContainer");
let credits = document.getElementById("credits");
let user_name = "";

const selectFile = () => {
  if (user_name) {
    uploadFile()
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
  const isAdmin =  response.data.admin;

  if (status == 200 ) {
    user_name = response.data.name;
    const name = response.data.name;
    const admin = response.data.admin;
    const email = response.data.email;
    const picture = response.data.picture;
    const expiry = response.data.expiry;
    profile.style.display = "inline";
    signInContainer.style.display = "none";

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

    document.getElementById("payments-container").innerHTML = `<a class="nav-link active" aria-current="page" href="/payments?token=${token}">Buy Credits</a>`

    document.getElementById("picture").src = picture;
    document.cookie = `token=${token};expires=${expiry}`;
    console.log(`${name} signed in successfully.`);
    console.log(`admin: ${admin}, isAdmin:${isAdmin}`);
    
    return email;
  } 
  else {
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
        document.getElementById("home-container").innerHTML = " ";
        document.getElementById("payments-container").innerHTML = " ";
        profile.style.display = "none";
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
         credits.innerHTML = "Credits: "+response.data.credits;
         tempcred = response.data.credits;
         sessionStorage.setItem("credits", response.data.credits);
        console.log("SetItem in session: " + response.data.credits);
        if (response.data.admin == "true" || response.data.admin) 
        {
          document.getElementById("home-container").innerHTML = `<a class="nav-link active" aria-current="page" href="/home?token=${token}">Home</a>`
          console.log("Heyllo wow am admin!!");
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

async function getcredits(){
  console.log("oogbabagbobgaobgoabogabogboagbogbaobgoba");
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