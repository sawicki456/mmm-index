document.getElementById('upload-btn').onclick = function() {
  // Placeholder: just open the Drive folder in a new tab.
  window.open('https://drive.google.com/drive/folders/135BPvCXeRAXDOEMAlenWzoicRmtn_e_7', '_blank');
  document.getElementById('status').innerText = "Drive folder opened in new tab.";
};

document.getElementById('trigger-index-btn').onclick = async function() {
  const status = document.getElementById('status');
  status.innerText = "Triggering index update...";
  try {
    await fetch('https://script.google.com/macros/s/AKfycbx_ViRshOUP8y3eR-RbQDX9o2nEGvP7_vLdW_GPLnGE0cdv1jcCU9us7DxUAOO1Fc5N_w/exec', { method: 'POST' });
    status.innerText = "Index update triggered!";
  } catch (e) {
    status.innerText = "Error triggering index update!";
  }
};

document.getElementById('reminder-btn').onclick = function() {
  const REMINDER = `Review the latest project index and files before generating art or text. Use only canonical character, location, and object references from the index. Ensure all outputs are consistent with existing assets and do not invent or change any details without explicit instruction.`;
  navigator.clipboard.writeText(REMINDER);
  document.getElementById('status').innerText = "Reminder copied!";
};
