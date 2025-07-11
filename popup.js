<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Macho Hat Uploader</title>
  <!-- Google Identity Services -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <!-- Google APIs for Picker -->
  <script src="https://apis.google.com/js/api.js"></script>
  <script src="https://apis.google.com/js/api/picker.js"></script>
  <style>
    body { background: #1a1a22; color: #fff; width: 320px; font-family: sans-serif; padding: 24px 0 12px 0; margin: 0; }
    #hat-img { display: block; margin: 0 auto 20px auto; width: 72px; height: 72px; border-radius: 50%; border: 2px solid #fff; background: #d00; box-shadow: 0 0 12px #222a; }
    .menu-btn { width: 90%; display: block; margin: 14px auto; font-size: 17px; padding: 14px 0; border: none; border-radius: 12px; background: #36364a; color: #fff; font-weight: bold; cursor: pointer; transition: background 0.15s; }
    .menu-btn:hover { background: #464666; }
    #status { margin-top: 12px; text-align: center; font-size: 14px; min-height: 20px; }
  </style>
</head>
<body>
  <img src="https://raw.githubusercontent.com/sawicki456/mmm-index/refs/heads/main/hat.png" id="hat-img" alt="Macho Hat">
  <button class="menu-btn" id="upload-btn">Upload Art to Google Drive</button>
  <button class="menu-btn" id="trigger-index-btn">Trigger Index Update</button>
  <button class="menu-btn" id="reminder-btn">Copy Consistency Reminder</button>
  <div id="status"></div>
  <script>
    // Timestamp for debug/build tracking
    console.log('POPUP.JS LOADED:', new Date().toISOString());

    // --- CONFIGURATION ---
    const CLIENT_ID = '705073291364-vepbigh687lpkg1qjosupk9961nbnagd.apps.googleusercontent.com';
    const DEVELOPER_KEY = 'AIzaSyCbNx0M5dMLY-51grw45LJRLjfC_f8eniA';
    const APP_ID = '705073291364';
    const ROOT_FOLDER_ID = '135BPvCXeRAXDOEMAlenWzoicRmtn_e_7';
    const SCOPE = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly';

    const INDEX_TRIGGER_URL = 'https://script.google.com/macros/s/AKfycbx_ViRshOUP8y3eR-RbQDX9o2nEGvP7_vLdW_GPLnGE0cdv1jcCU9us7DxUAOO1Fc5N_w/exec';

    let pickerInited = false;
    let tokenClient;
    let accessToken = null;

    // Wait until all APIs are loaded (especially google.picker)
    function ready(fn) {
      if (window.google && window.google.picker && window.gapi && window.gapi.load) fn();
      else setTimeout(() => ready(fn), 100);
    }

    // Picker API loader
    function loadPickerApi() {
      gapi.load('picker', {callback: () => { pickerInited = true; }});
    }

    ready(() => {
      // GIS Init
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            accessToken = tokenResponse.access_token;
            showFolderPicker();
          }
        },
      });

      // Picker Init
      gapi.load('client', {callback: loadPickerApi});

      document.getElementById('upload-btn').onclick = () => {
        document.getElementById('status').innerText = 'Select target folder...';
        if (accessToken) {
          showFolderPicker();
        } else {
          tokenClient.requestAccessToken();
        }
      };

      document.getElementById('reminder-btn').onclick = () => {
        const REMINDER = `Review the latest project index and files before generating art or text. Use only canonical character, location, and object references from the index. Ensure all outputs are consistent with existing assets and do not invent or change any details without explicit instruction.`;
        navigator.clipboard.writeText(REMINDER);
        document.getElementById('status').innerText = "Reminder copied!";
      };

      document.getElementById('trigger-index-btn').onclick = () => {
        document.getElementById('status').innerText = "Index update triggered, please wait...";
        fetch(INDEX_TRIGGER_URL, { method: "POST", mode: "no-cors" })
          .then(() => {
            document.getElementById('status').innerText = "Index update triggered!";
          })
          .catch(() => {
            document.getElementById('status').innerText = "Error triggering index update!";
          });
      };
    });

    // Step 1: Show the Folder Picker dialog to select target folder
    function showFolderPicker() {
      if (!pickerInited || !accessToken) {
        document.getElementById('status').innerText = 'Google Picker not ready.';
        return;
      }
      const folderView = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true)
        .setParent(ROOT_FOLDER_ID);

      const picker = new google.picker.PickerBuilder()
        .setAppId(APP_ID)
        .setOAuthToken(accessToken)
        .setDeveloperKey(DEVELOPER_KEY)
        .addView(folderView)
        .setCallback(folderPickerCallback)
        .build();
      picker.setVisible(true);
      document.getElementById('status').innerText = 'Choose a folder to upload into.';
    }

    // Step 2: After folder is selected, show upload dialog for that folder
    function folderPickerCallback(data) {
      if (data.action === google.picker.Action.PICKED) {
        const folderId = data.docs[0].id;
        showUploadPicker(folderId);
      } else if (data.action === google.picker.Action.CANCEL) {
        document.getElementById('status').innerText = 'Folder selection cancelled.';
      }
    }

    function showUploadPicker(targetFolderId) {
      const uploadView = new google.picker.DocsUploadView().setParent(targetFolderId);

      const picker = new google.picker.PickerBuilder()
        .setAppId(APP_ID)
        .setOAuthToken(accessToken)
        .setDeveloperKey(DEVELOPER_KEY)
        .addView(uploadView)
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
      document.getElementById('status').innerText = '';
    }

    // Standard pickerCallback for upload
    function pickerCallback(data) {
      if (data.action === google.picker.Action.PICKED) {
        const file = data.docs[0];
        document.getElementById('status').innerText = `Uploaded: ${file.name}`;
      } else if (data.action === google.picker.Action.CANCEL) {
        document.getElementById('status').innerText = 'Upload cancelled.';
      }
    }
  </script>
</body>
</html>
