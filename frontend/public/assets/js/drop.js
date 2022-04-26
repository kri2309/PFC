let dropArea = document.getElementById("drop-area");
let dropText = document.getElementById("upload-text");

if (dropArea != null && dropText != null) {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    dropText.addEventListener(eventName, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
    dropText.addEventListener(eventName, highlight, false);
  });
  ["dragleave"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
    dropText.addEventListener(eventName, unhighlight, false);
  });

  ["drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, dropped, false);
    dropText.addEventListener(eventName, dropped, false);
  });
  dropArea.addEventListener("drop", handleDrop, false);
  dropText.addEventListener("drop", handleDrop, false);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropText.innerHTML = "You got it!";
}

function unhighlight(e) {
  dropText.innerHTML = "Image Here";
}

function dropped(e) {
  dropText.innerHTML = "Got it!";
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  if (user_name) {
    let dt = e.dataTransfer;
    let files = dt.files;
    ext = files[0].name.split(".")[files[0].name.split(".").length - 1];
    if (ext == "docx" || ext == "jpg" || ext == "png") {
      uploadFile(files[0]);
    } else {
      alert("Error: Invalid file type! Please select a docx/jpg/png file.");
    }
  } else {
    document.getElementById("upload-text").innerHTML = "Image Here";
    alert("Error: You need to login first!");
  }
}
let dropArea = document.getElementById("drop-area");
let dropText = document.getElementById("upload-text");

if (dropArea != null && dropText != null) {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    dropText.addEventListener(eventName, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
    dropText.addEventListener(eventName, highlight, false);
  });
  ["dragleave"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
    dropText.addEventListener(eventName, unhighlight, false);
  });

  ["drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, dropped, false);
    dropText.addEventListener(eventName, dropped, false);
  });
  dropArea.addEventListener("drop", handleDrop, false);
  dropText.addEventListener("drop", handleDrop, false);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropText.innerHTML = "You got it!";
}

function unhighlight(e) {
  dropText.innerHTML = "Image Here";
}

function dropped(e) {
  dropText.innerHTML = "Got it!";
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  if (user_name) {
    let dt = e.dataTransfer;
    let files = dt.files;
    ext = files[0].name.split(".")[files[0].name.split(".").length - 1];
    if (ext == "docx" || ext == "jpg" || ext == "png") {
      uploadFile(files[0]);
    } else {
      alert("Error: Invalid file type! Please select a docx/jpg/png file.");
    }
  } else {
    document.getElementById("upload-text").innerHTML = "Image Here";
    alert("Error: You need to login first!");
  }
}
