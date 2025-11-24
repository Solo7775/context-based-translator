console.log("AI Translator Background Script Loaded (v1.1 - Fix Connection Error)");

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "translate-selection",
        title: "Translate with AI",
        contexts: ["selection"]
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "translate-selection") {
        const selectedText = info.selectionText;

        try {
            // Send message to content script to show loading state
            await sendMessageToTab(tab.id, {
                action: "show_loading",
                text: selectedText
            });

            // Get context from content script
            let context = "";
            let url = "";
            try {
                const response = await chrome.tabs.sendMessage(tab.id, { action: "get_context" });
                if (response) {
                    context = response.context || "";
                    url = response.url || "";
                }
            } catch (e) {
                console.warn("Could not get context:", e);
            }

            const result = await translateWithContext(selectedText, context, url);

            await sendMessageToTab(tab.id, {
                action: "show_result",
                original: selectedText,
                translated: result.translation,
                explanation: result.explanation,
                detectedLanguage: result.detected_language
            });
        } catch (error) {
            console.error("Translation flow error:", error);
            // Try to show error on page if possible
            try {
                await sendMessageToTab(tab.id, {
                    action: "show_error",
                    error: error.message
                });
            } catch (e) {
                console.error("Could not show error on page:", e);
            }
        }
    }
});

async function sendMessageToTab(tabId, message) {
    try {
        await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
        if (error.message.includes("Could not establish connection")) {
            // Content script might not be loaded (e.g. tab opened before extension installation)
            // Inject content script and styles
            await chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["styles.css"]
            });
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["content.js"]
            });

            // Retry sending message
            await chrome.tabs.sendMessage(tabId, message);
        } else {
            throw error;
        }
    }
}

async function translateWithContext(text, context, url) {
    // Get API key, target language, and model
    const data = await chrome.storage.local.get(['openRouterApiKey', 'targetLanguage', 'openRouterModel']);
    const apiKey = data.openRouterApiKey;
    const targetLang = data.targetLanguage || 'English';
    const model = data.openRouterModel || 'openai/gpt-3.5-turbo';

    if (!apiKey) {
        throw new Error("Please set your OpenRouter API Key in the extension settings.");
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://github.com/Solo7775/context-based-translator', // Optional but good practice
                'X-Title': 'AI Translator'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "system",
                        content: `You are a professional translator. Your task is to:
1. Analyze the provided URL to understand the website's context (e.g., news, technical docs, e-commerce).
2. Translate the user's text into ${targetLang} based on this context.
   - CRITICAL: The "translation" field MUST be in ${targetLang}.
   - If the source text is already in ${targetLang}, return it as is or slightly polished, but DO NOT translate it to English.
3. Provide a simple, beginner-friendly explanation of the original text, referencing the website context if relevant. The explanation MUST be in ${targetLang}.
4. Detect the language of the original text and return its ISO 639-1 code (e.g., "en", "es", "fr", "ja") as "detected_language".

Return the result as a JSON object with keys: "translation", "explanation", and "detected_language".
"translation": The translated text in ${targetLang}.
"explanation": The explanation in ${targetLang}.
"detected_language": The ISO 639-1 code of the original text.`
                    },
                    {
                        role: "user",
                        content: `Context: ${context}\nURL: ${url}\n\nText to translate: ${text}`
                    }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to translate');
        }

        const result = await response.json();
        const content = result.choices[0].message.content.trim();

        try {
            return JSON.parse(content);
        } catch (e) {
            // Fallback if JSON parsing fails
            console.warn("Failed to parse JSON response:", content);
            return {
                translation: content,
                explanation: "Could not parse explanation."
            };
        }
    } catch (err) {
        console.error("Translation error:", err);
        throw err;
    }
}
