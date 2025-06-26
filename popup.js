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
