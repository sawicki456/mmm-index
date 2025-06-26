document.getElementById('upload-btn').onclick = function() {
  // This is a placeholder! Add your upload logic if needed, or just open your Drive folder.
  window.open('https://drive.google.com/drive/folders/135BPvCXeRAXDOEMAlenWzoicRmtn_e_7', '_blank');
  document.getElementById('status').innerText = "Drive folder opened in new tab.";
};

document.getElementById('reminder-btn').onclick = function() {
  const REMINDER = `Review the latest project index and files before generating art or text. Use only canonical character, location, and object references from the index. Ensure all outputs are consistent with existing assets and do not invent or change any details without explicit instruction.`;
  navigator.clipboard.writeText(REMINDER);
  document.getElementById('status').innerText = "Reminder copied!";
};
