<div align="center">
  <img src="icons/icon128.png" alt="AI Translator Logo" width="120"/>
  
  # 🌐 AI Translator
  
  **Context-Aware Translation Chrome Extension**
  
  [![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)](https://github.com/Solo7775/context-based-translator)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![OpenRouter](https://img.shields.io/badge/Powered%20by-OpenRouter-purple)](https://openrouter.ai)
  
  *Translate any text on any webpage with AI-powered context awareness and multi-language support.*
  
</div>

---

## ✨ Features

### 🎯 **Context-Aware Translation**
Analyzes the website URL and surrounding text to provide **accurate, contextually relevant** translations.

### 💡 **Smart Explanations**
Get simple, beginner-friendly explanations of the translated text **in your target language**.

### 🔊 **Multi-Language Text-to-Speech**
Listen to the original text with **automatic language detection** and native pronunciation.

### 🤖 **Any AI Model**
Access **100+ AI models** via OpenRouter:
- OpenAI (GPT-3.5, GPT-4, GPT-4o)
- Anthropic (Claude 3 Opus, Sonnet, Haiku)
- Google (Gemini Pro, Gemini Flash)
- Meta (Llama models)
- And many more!

### 🌍 **Multi-Language Support**
Translate to and from:
- 🇬🇧 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇨🇳 Chinese (Simplified)
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇷🇺 Russian
- 🇮🇳 Hindi

### 🔒 **Privacy-Focused**
Your API key is **stored locally** in your browser. No data is sent to third parties except the AI provider you choose.

---

## 📦 Installation

### Option 1: Install from Source (Developer Mode)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Solo7775/context-based-translator.git
   cd context-based-translator
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/` in your Chrome browser
   - Or click the puzzle icon → "Manage Extensions"

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `context-based-translator` directory
   - The extension icon should appear in your toolbar!

---

## ⚙️ Configuration

### Step 1: Get Your OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Click "Create Key" and copy your API key (starts with `sk-or-...`)

### Step 2: Configure the Extension

1. **Open Settings**
   - Click the AI Translator icon in your Chrome toolbar
   - The settings popup will appear

2. **Select Your AI Model**
   - Click the dropdown menu under "Model"
   - Browse through 100+ available models
   - Popular choices:
     - `openai/gpt-3.5-turbo` (Fast & Affordable)
     - `openai/gpt-4o` (High Quality)
     - `anthropic/claude-3-opus` (Best Overall)
     - `google/gemini-pro` (Google's Latest)
   - Click the refresh button (↻) to update the model list

3. **Enter Your API Key**
   - Paste your OpenRouter API key in the "OpenRouter API Key" field
   - Your key is stored securely in your browser's local storage

4. **Choose Target Language**
   - Select your preferred translation language from the dropdown
   - This is the language all translations will be converted to

5. **Save Settings**
   - Click "Save Settings"
   - You should see a "Settings saved!" confirmation

---

## 🚀 Usage

### Basic Translation

1. **Select Text**
   - Highlight any text on any webpage
   
2. **Translate**
   - Right-click on the selected text
   - Click "Translate with AI" from the context menu
   
3. **View Results**
   - A sleek overlay will appear with:
     - ✅ The original text (with a play button to listen)
     - ✅ The translation in your target language
     - ✅ A simple explanation in your target language

### Features in Action

#### 🔊 **Listen to Original Text**
- Click the **play button (▶)** next to the original text
- The extension automatically detects the language and uses the correct voice

#### 📖 **Understand the Context**
- Read the **explanation section** to understand:
  - What the text means
  - How it's used in context
  - Cultural or technical nuances

#### 🖱️ **Drag the Window**
- Click and drag the **header** to reposition the translation overlay
- Click the **× button** to close

---

## 🛠️ Advanced Tips

### Choosing the Right Model

| Use Case | Recommended Model | Why? |
|----------|-------------------|-------|
| **Daily browsing** | `openai/gpt-3.5-turbo` | Fast and cost-effective |
| **Technical docs** | `openai/gpt-4o` | Better understanding of complex terms |
| **Best quality** | `anthropic/claude-3-opus` | Most accurate translations |
| **Free tier** | `google/gemini-pro:free` | No cost (limited usage) |

### Keyboard Shortcuts

While there are no default shortcuts, you can set them up:
1. Go to `chrome://extensions/shortcuts`
2. Find "AI Translator"
3. Assign a custom keyboard shortcut

---

## 🐛 Troubleshooting

### Extension Not Working?

**Problem**: Right-click menu doesn't show "Translate with AI"
- **Solution**: Reload the page after installing the extension

**Problem**: "Please set your OpenRouter API Key" error
- **Solution**: Open settings and enter a valid OpenRouter API key

**Problem**: Models not loading in dropdown
- **Solution**: Check your internet connection and click the refresh button (↻)

**Problem**: Translation fails or returns error
- **Solution**: 
  - Verify your API key is correct
  - Check you have credits in your OpenRouter account
  - Try a different model

### Need More Help?

[Open an issue](https://github.com/Solo7775/context-based-translator/issues) on GitHub

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Powered by [OpenRouter](https://openrouter.ai)
- Built with ❤️ for language learners and global communication

---

<div align="center">
  
  **⭐ Star this repo if you find it useful!**
  
  [Report Bug](https://github.com/Solo7775/context-based-translator/issues) · [Request Feature](https://github.com/Solo7775/context-based-translator/issues)
  
</div>
