<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Macho Hat Toolbox</title>
  <style>
    body { background: #181820; color: #fff; width: 260px; font-family: sans-serif; padding: 24px 0 12px 0; margin: 0; }
    #hat-img { display: block; margin: 0 auto 16px auto; width: 64px; height: 64px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 12px #222a; background: #d00; }
    .main-btn { width: 90%; display: block; margin: 13px auto; font-size: 16px; padding: 13px 0; border: none; border-radius: 10px; background: #36364a; color: #fff; font-weight: bold; cursor: pointer; transition: background 0.13s; }
    .main-btn:hover { background: #50446c; }
    #status { margin-top: 15px; text-align: center; font-size: 15px; min-height: 18px; }
  </style>
</head>
<body>
  <img id="hat-img" src="macho_hat.png" alt="Macho Hat">
  <button class="main-btn" id="open-drive-btn">Open Drive Folder</button>
  <button class="main-btn" id="trigger-index-btn">Trigger Index Update</button>
  <button class="main-btn" id="copy-reminder-btn">Copy Consistency Reminder</button>
  <div id="status"></div>
  <script>
    document.getElementById('open-drive-btn').onclick = function() {
      window.open('https://drive.google.com/drive/folders/135BPvCXeRAXDOEMAlenWzoicRmtn_e_7', '_blank');
    };

    document.getElementById('trigger-index-btn').onclick = async function() {
      const status = document.getElementById('status');
      status.innerText = "Triggering index update...";
      try {
        await fetch('https://script.google.com/macros/s/AKfycbxeEU03qJoe0r8f2MR1ZxORvGadUld8LfVNfemkotbAnpneJ9r-G4OwAfK1_Mq_e0QE/exec', { method: 'POST' });
        status.innerText = "Index update triggered!";
      } catch(e) {
        status.innerText = "Error triggering index update!";
      }
    };

    document.getElementById('copy-reminder-btn').onclick = function() {
      const REMINDER = `Review the latest project index and files before generating art or text. Use only canonical character, location, and object references from the index. Ensure all outputs are consistent with existing assets and do not invent or change any details without explicit instruction.`;
      navigator.clipboard.writeText(REMINDER);
      document.getElementById('status').innerText = "Reminder copied!";
    };
  </script>
</body>
</html>
