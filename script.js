// Configuration - REPLACE THESE VALUES!
const CLIENT_ID = '949186431784-mk1meauqa5qjnagcb7gsqb8pgajm69l3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDI6kdgDFB4swqMw3TN_kXh78RSC0mW0Ds'; // Optional but recommended

// Debug state
console.log("Script loaded. Initializing...");

let googleAuth;
let pickerApiLoaded = false;

// Load Google APIs
function loadGoogleApi() {
  console.log("Loading Google APIs...");
  
  gapi.load('auth', {
    callback: () => {
      console.log("Auth API loaded");
      onAuthApiLoad();
    },
    onerror: () => console.error("Failed to load Auth API")
  });
  
  gapi.load('picker', {
    callback: () => {
      console.log("Picker API loaded");
      pickerApiLoaded = true;
    },
    onerror: () => console.error("Failed to load Picker API")
  });
}

function onAuthApiLoad() {
  console.log("Initializing auth...");
  googleAuth = gapi.auth2.init({
    client_id: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/drive.file'
  }).then(
    () => console.log("Auth initialized successfully"),
    (err) => console.error("Auth init failed:", err)
  );
}

function showPicker() {
  console.log("Show picker called");
  
  if (!pickerApiLoaded || !googleAuth) {
    console.error("APIs not loaded yet");
    alert("Please wait while Google APIs load. Try again in a few seconds.");
    return;
  }

  console.log("Signing in...");
  googleAuth.signIn()
    .then(() => {
      const user = googleAuth.currentUser.get();
      const token = user.getAuthResponse().id_token;
      console.log("Auth token received");
      createPicker(token);
    })
    .catch(err => {
      console.error("Sign-in error:", err);
      alert("Sign-in failed: " + err.error);
    });
}

function createPicker(token) {
  console.log("Creating picker...");
  const view = new google.picker.View(google.picker.ViewId.DOCS_IMAGES);
  const picker = new google.picker.PickerBuilder()
    .setOAuthToken(token)
    .addView(view)
    .setCallback(pickerCallback)
    .build();
    
  console.log("Showing picker...");
  picker.setVisible(true);
}

function pickerCallback(data) {
  console.log("Picker callback:", data);
  if (data.action === google.picker.Action.PICKED) {
    const fileId = data.docs[0].id;
    alert(`Successfully uploaded! File ID: ${fileId}`);
    loadPhotos();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded");
  
  const uploadBtn = document.getElementById('upload-btn');
  uploadBtn.addEventListener('click', showPicker);

  // Load Google API script
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.onload = () => {
    console.log("Google API script loaded");
    loadGoogleApi();
  };
  script.onerror = () => console.error("Failed to load Google API script");
  document.head.appendChild(script);
});