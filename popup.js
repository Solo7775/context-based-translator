document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const modelIdSelect = document.getElementById('modelId');
  const refreshModelsBtn = document.getElementById('refreshModels');
  const targetLangSelect = document.getElementById('targetLang');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  chrome.storage.local.get(['openRouterApiKey', 'targetLanguage', 'openRouterModel', 'cachedModels'], (result) => {
    if (result.openRouterApiKey) {
      apiKeyInput.value = result.openRouterApiKey;
    }
    if (result.targetLanguage) {
      targetLangSelect.value = result.targetLanguage;
    }

    // Load models
    if (result.cachedModels) {
      populateModelSelect(result.cachedModels, result.openRouterModel);
    } else {
      fetchModels(result.openRouterModel);
    }
  });

  refreshModelsBtn.addEventListener('click', () => {
    fetchModels(modelIdSelect.value);
  });

  function fetchModels(selectedModel) {
    modelIdSelect.innerHTML = '<option value="" disabled selected>Loading...</option>';

    fetch('https://openrouter.ai/api/v1/models')
      .then(response => response.json())
      .then(data => {
        const models = data.data.sort((a, b) => a.name.localeCompare(b.name));
        chrome.storage.local.set({ cachedModels: models });
        populateModelSelect(models, selectedModel);
        showStatus('Models refreshed', 'success');
      })
      .catch(error => {
        console.error('Error fetching models:', error);
        showStatus('Failed to fetch models', 'error');
        // Fallback to basic options if fetch fails
        const fallbackModels = [
          { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
          { id: 'openai/gpt-4o', name: 'GPT-4o' },
          { id: 'google/gemini-pro', name: 'Gemini Pro' }
        ];
        populateModelSelect(fallbackModels, selectedModel);
      });
  }

  function populateModelSelect(models, selectedModel) {
    modelIdSelect.innerHTML = '';

    // Add default/selected if not in list (edge case)
    let found = false;

    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name || model.id;
      modelIdSelect.appendChild(option);
      if (model.id === selectedModel) found = true;
    });

    if (selectedModel && !found) {
      const option = document.createElement('option');
      option.value = selectedModel;
      option.textContent = selectedModel + ' (Saved)';
      modelIdSelect.appendChild(option);
    }

    if (selectedModel) {
      modelIdSelect.value = selectedModel;
    } else {
      // Default to gpt-3.5-turbo if available, or first option
      if (models.find(m => m.id === 'openai/gpt-3.5-turbo')) {
        modelIdSelect.value = 'openai/gpt-3.5-turbo';
      } else if (models.length > 0) {
        modelIdSelect.value = models[0].id;
      }
    }
  }

  // Save settings
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const targetLanguage = targetLangSelect.value;
    const model = modelIdSelect.value;

    if (!apiKey) {
      showStatus('Please enter an API Key', 'error');
      return;
    }

    if (!model) {
      showStatus('Please enter a Model ID', 'error');
      return;
    }

    chrome.storage.local.set({
      openRouterApiKey: apiKey,
      targetLanguage: targetLanguage,
      openRouterModel: model
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
