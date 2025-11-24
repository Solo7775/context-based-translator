document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const targetLangSelect = document.getElementById('targetLang');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  chrome.storage.local.get(['openaiApiKey', 'targetLanguage'], (result) => {
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
    }
    if (result.targetLanguage) {
      targetLangSelect.value = result.targetLanguage;
    }
  });

  // Save settings
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const targetLanguage = targetLangSelect.value;

    if (!apiKey) {
      showStatus('Please enter an API Key', 'error');
      return;
    }

    chrome.storage.local.set({
      openaiApiKey: apiKey,
      targetLanguage: targetLanguage
    }, () => {
      showStatus('Settings saved!', 'success');
      // Notify background script to update context menu if needed (though not strictly necessary for just settings)
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = type;
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = '';
    }, 2000);
  }
});
