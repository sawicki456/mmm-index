const CLIENT_ID = '705073291364-vepbigh687lpkg1qjosupk9961nbnagd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCbNx0M5dMLY-51grw45LJRLjfC_f8eniA';
const ROOT_FOLDER_ID = '135BPvCXeRAXDOEMAlenWzoicRmtn_e_7'; // Your main project folder

const SCOPE = ['https://www.googleapis.com/auth/drive.file'];

let oauthToken = null;

// Button click handler for upload
document.getElementById('upload-btn').onclick = function() {
  document.getElementById('status').innerText = "Loading Google Picker...";
  // Load APIs
  gapi.load('client:auth2', onAuthApiLoad);
  gapi.load('picker', onPickerApiLoad);
};

function onAuthApiLoad() {
  gapi.auth2.init({
    client_id: CLIENT_ID,
    scope: SCOPE.join(' ')
  }).then(function() {
    // Sign in (prompts user if not already)
    gapi.auth2.getAuthInstance().signIn().then(function(user) {
      oauthToken = user.getAuthResponse().access_token;
      if (window.pickerApiLoaded) {
        showPicker();
      }
    });
  });
}

function onPickerApiLoad() {
  window.pickerApiLoaded = true;
  if (oauthToken) {
    showPicker();
  }
}

function showPicker() {
  if (!oauthToken) {
    document.getElementById('status').innerText = "Auth failed. Try again.";
    return;
  }
  const picker = new google.picker.PickerBuilder()
    .addView(new google.picker.DocsUploadView().setParent(ROOT_FOLDER_ID))
    .setOAuthToken(oauthToken)
    .setDeveloperKey(API_KEY)
    .setCallback(pickerCallback)
    .setTitle('Upload Art to Google Drive')
    .build();
  picker.setVisible(true);
}

function pickerCallback(data) {
  if (data.action === google.picker.Action.PICKED) {
    const file = data.docs[0];
    document.getElementById('status').innerText = `Uploaded: ${file.name}`;
  } else if (data.action === google.picker.Action.CANCEL) {
    document.getElementById('status').innerText = "Upload canceled.";
  }
}
