let signInButton = document.getElementById("signIn");
let signOutButton = document.getElementById("signOut");
let profile = document.getElementById("profile");
let signInContainer = document.getElementById("signInContainer");
let credits = document.getElementById("credits");
let user_name = "";
var email = "";
let new10credits = document.getElementById("10credits");
let new20credits = document.getElementById("20credits");
let new30credits = document.getElementById("30credits");
let new10creditslabel = document.getElementById("10creditslabel");
let new20creditslabel = document.getElementById("20creditslabel");
let new30creditslabel = document.getElementById("30creditslabel");

//checking if user is logged in before letting them upload
const selectFile = () => {
  if (user_name) {
    uploadFile();
  } else {
    alert("Error: You need to login first!");
  }
};

//google auth
const authenticateReq = async (token) => {
  const url = `https://kristinaborgolivier.me/auth?token=${token}`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  const status = response.data.status;

  //if logged in show log in content
  if (status == 200) {
    user_name = response.data.name;
    const name = response.data.name;
    email = response.data.email;
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

    document.getElementById(
      "payments-container"
    ).innerHTML = `<a class="nav-link active" aria-current="page" href="/payments?token=${token}">Home</a>`;

    var button = document.getElementById("convert");
    if(button!=null){
      button.innerHTML = `<button
      type="button"
      class="btn btn-dark"
      onclick="selectFile()"
    >
      Convert
    </button>`;
    }

    document.getElementById("picture").src = picture;
    document.cookie = `token=${token};expires=${expiry}`;
    console.log(`${name} signed in successfully.`);

    return email;
  }
   else {
     //if not logged in remove the content
    profile.style.display = "none";
    signInContainer.style.display = "inline";
    document.getElementById("admin-container").innerHTML = " ";
    return null;
  }
};
//google stuff to login
async function loadGoogleLogin() {
  let session = document.cookie;
  if (session && session.includes("token")) {
    email = await authenticateReq(session.split("token=")[1].split(";")[0]);

    if (email != null) {
      const url = "/login?email=" + email;
      const headers = {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      };
      const response = await axios.post(url, headers);
     
      console.log(response.data.admin);
      if (response.data.admin) {
        console.log(response.data.admin);
        document.getElementById("admin-container").innerHTML = (`<a class="nav-link active" aria-current="page" href="/admin">Admin Panel</a>`);
      }else{
        document.getElementById("admin-container").innerHTML = " ";
      }
     
    }
  } else {
    profile.style.display = "none";
    signInContainer.style.display = "inline";
    document.getElementById("admin-container").innerHTML = " ";
  }
//when one signs out this happens 
  const signOut = () => {
    let auth2 = gapi.auth2.getAuthInstance();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    auth2
      .signOut()
      .then(() => {
        document.getElementById("admin-container").innerHTML = " ";
        document.getElementById("payments-container").innerHTML = " ";
        var button = document.getElementById("convert");
        if(button!=null){
          button.innerHTML = `<button
          type="button"
          class="btn btn-dark"
          onclick="selectFile()"
        >
          Convert
        </button>`;
        }
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

        email = await authenticateReq(
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
          if (response.data.admin == true) {
            console.log(response.data.admin);
            document.getElementById("admin-container").innerHTML = (`<a class="nav-link active" aria-current="page" href="/admin">Admin Panel</a>`);

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

//to get the credits when the page loads or when the user buys 
async function RunCredits() {
  console.log(email);
  const url = `/credits?email=${email}`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  console.log(`Runtime credits: ${response.data.credits}`);
  credits.innerHTML = "Credits:" + response.data.credits;
}

//gets all the conversions of this user 
async function GetDocs() {
  console.log(email);
  const url = `/getalldocs?email=${email}`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  console.log(response.data.alldocs);
  let allData = response.data.alldocs;
  const table = document.getElementById("table-container");
  for( var i = 0; i <allData.length; i++){
    var oneData = allData[i];
    const el = document.createElement("table-alldocs");
    el.innerHTML = `
    <table style = "border: 1px solid #ddd;
    text-align: left;   border-collapse: collapse;
    width: 100%;">
    <thead style =  "border: 1px solid #ddd;
    text-align: left; padding: 15px;">
    <tr>
      <th scope="col">File Name</th>
      <th scope="col">Email</th>
      <th scope="col">Link</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style =  "border: 1px solid #ddd;
      text-align: left; padding: 15px;">${oneData.filename}</td>
      <td style = " border: 1px solid #ddd;
      text-align: left; padding: 15px;">${oneData.email}</td>
      <td style = " border: 1px solid #ddd;
      text-align: left; padding: 15px;  background-color: #fff;
      color: white;
      padding: 14px 25px;
      text-align: center;
      text-decoration: none;
      display: inline-block;">
      <a href="${oneData.completed}" target="_blank">Converted File here</a>
      
      </td>
    </tr>
    </body>
    </table>
    `
    table.appendChild(el);
  }
};

//sees if user is an admin or nah
async function GetAdminInfo() {
  const url = `/admin`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  if (Boolean(response.data.admin) == true) {
    document.getElementById("admin-container").innerHTML = (`<a class="nav-link active" aria-current="page" href="/admin">Admin Panel</a>`);
  } else {
    document.getElementById("admin-container").innerHTML = " ";
  }
}

//adds the credits when one buys
async function AddCredits(number) {
  const url = `setcredits?email=${email}&number=${number}`;
  const res = await axios.post(url);
  console.log("bought credits: "+number);
  //calls this to refresh the credits
  RunCredits();

}

//from the admin table gets new prices
async function SetNewCredits(){ 
  console.log("Setting new credits!");
  var new10 = new10credits.value;
  var new20 = new20credits.value;
  var new30 = new30credits.value;
  console.log(`10: ${new10}, 20: ${new20}, 30: ${new30}`);
  const url = `/setrediscredits`
  const res = await axios.post(url, {
    credits10:new10,
    credits20:new20,
    credits30:new30
  });
}

//actually changes the prices
async function ChangeCreditPrices(){

  const url = `/getcreditprices`;
  const response = await axios.post(url);

  var NewPrices = JSON.parse(response.data.creditPrices);
  NewPrices = JSON.parse(NewPrices);

  new10creditslabel.innerHTML =` 10 credits - ???${NewPrices.credits10}`;
  new20creditslabel.innerHTML =` 20 credits - ???${NewPrices.credits20}`;
  new30creditslabel.innerHTML =` 30 credits - ???${NewPrices.credits30}`;
}
