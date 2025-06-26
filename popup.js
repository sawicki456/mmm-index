// --- CONFIGURATION ---
const CLIENT_ID = '705073291364-vepbigh687lpkg1qjosupk9961nbnagd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCbNx0M5dMLY-51grw45LJRLjfC_f8eniA';
const ROOT_FOLDER_ID = '135BPvCXeRAXDOEMAlenWzoicRmtn_e_7';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';

let accessToken = null;
let pickerInited = false;
let tokenClient = null;

function setStatus(msg) {
  document.getElementById('status').innerText = msg;
}

// Wait until all Google APIs are loaded
function ready(fn) {
  if (
    window.gapi && gapi.load &&
    window.google && google.accounts && google.accounts.oauth2 &&
    window.google.picker
  ) {
    fn();
  } else {
    setTimeout(() => ready(fn), 50);
  }
}

// Main logic (waits until APIs are loaded)
ready(() => {
  // Load Picker
  gapi.load('picker', { callback: () => { pickerInited = true; } });

  // Set up OAuth token client
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPE,
    callback: (tokenResponse) => {
      if (tokenResponse && tokenResponse.access_token) {
        accessToken = tokenResponse.access_token;
        showPicker();
      } else {
        setStatus('Failed to get access token.');
      }
    },
  });

  // Upload Art button
  document.getElementById('upload-btn').onclick = () => {
    setStatus('Loading Google Picker...');
    if (accessToken) {
      showPicker();
    } else {
      tokenClient.requestAccessToken();
    }
  };
});

// -- Show Picker Dialog --
function showPicker() {
  if (!pickerInited) return setStatus('Picker not loaded yet. Try again.');
  if (!accessToken) return setStatus('No access token.');
  const picker = new google.picker.PickerBuilder()
    .addView(new google.picker.DocsUploadView().setParent(ROOT_FOLDER_ID))
    .setOAuthToken(accessToken)
    .setDeveloperKey(API_KEY)
    .setTitle('Upload Art to Google Drive')
    .setCallback(pickerCallback)
    .build();
  picker.setVisible(true);
  setStatus('');
}

// -- Picker Callback --
function pickerCallback(data) {
  if (data.action === google.picker.Action.PICKED) {
    const file = data.docs[0];
    setStatus(`Uploaded: ${file.name}`);
  } else if (data.action === google.picker.Action.CANCEL) {
    setStatus('Upload canceled.');
  }
}
