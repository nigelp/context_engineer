# 🧠 Context Engineer

A powerful AI context engineering tool that helps you build precise, structured prompts for optimal AI responses. Features a beautiful dark slate-blue interface with comprehensive model selection and detailed guidance. Inspired by Andrej Karpathy and this repo - https://github.com/davidkimai/Context-Engineering

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/context-engineer)

## ✨ Features

- 🛡️ **Rule-Based Constraints**: Set boundaries and requirements
- 🌐 **30+ AI Models**: Anthropic, OpenAI, Google, DeepSeek, Qwen, Meta, Mistral + more
- ✨ **Example Prompts**: Get started quickly with pre-built prompt templates for various tasks.
- 🆓 **Free Models**: Mix of premium and free models clearly labeled
- 🌙 **Dark Theme**: Beautiful dark slate-blue interface with aqua accents
- ℹ️ **Comprehensive Help**: Detailed hover tooltips with examples and guidance
- 📱 **PWA Ready**: Install as a native app on any device
- 📋 **Copy Responses**: Easy copy buttons for AI responses

## 🚀 Quick Deploy (Recommended)

### Option 1: One-Click Netlify Deploy
1. Click the "Deploy to Netlify" button above
2. Connect your GitHub account
3. Deploy automatically
4. Get your OpenRouter API key from [OpenRouter.ai](https://openrouter.ai)
5. Start building better prompts!

### Option 2: Fork & Deploy Manually
1. Fork this repository
2. Connect your GitHub to Netlify
3. Deploy the `client` folder
4. Your personal Context Engineer is ready!

## 🔧 Local Development

### Prerequisites
- Node.js (v16+)
- OpenRouter API key from [OpenRouter.ai](https://openrouter.ai)

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/context-engineer.git
cd context-engineer

# Install dependencies
npm run install-all

# Start development server
npm start

# build
npm run build
```

This starts:
- Client: http://localhost:3000

## 🎯 How to Use

0. **(Optional) Load an Example**: Choose a pre-built prompt from the "Examples" menu as a guide to get started quickly.
1. **🎭 Define Persona**: Set the AI's role and expertise (hover ℹ️ for examples)
2. **📝 Write Prompt**: Clearly state your task (hover ℹ️ for guidance)
3. **🔍 Add Context**: Include constraints and background (hover ℹ️ for tips)
4. **💡 Provide Examples**: Show desired input/output patterns
5. **📐 Specify Format**: Define response structure and style
6. **🛡️ Set Rules**: Add specific boundaries and requirements
7. **🚀 Send to Model**: Choose from 30+ AI models and get results
8. **📋 Copy Results**: Use copy buttons to save responses

### 💡 Pro Tip
Hover over any ℹ️ icon for detailed guidance with examples!

## 💡 Example Prompts

The app now includes a selection of pre-built prompts to help you get started. Find them in the "Examples" dropdown.

### 1. **Python Function Expert**
- **Persona**: An expert in Python and data structures, specializing in writing clean, efficient, and well-documented code.
- **Prompt**: "Create a Python function to find the second largest number in a list of integers."
- **Result**: A well-structured function with code examples.

### 2. **Creative Writing Expert**
- **Persona**: An expert writer, specializing in humor and satire.
- **Prompt**: "Write a short story about ducks."
- **Result**: A fun short story on topic.

### 3. **Financial Analyst Expert**
- **Persona**: A certified financial analyst with 15 years of experience in portfolio risk assessment for retail clients.
- **Prompt**: "Analyze the risk profile of the provided stock portfolio [x] and provide recommendations."
- **Result**: A clear and concise summary risk analysis in Markdown format.

## 🤖 Supported AI Models

### 🔥 Popular Models
- **Anthropic**: Claude 3.5 Sonnet, Claude 3.5 Haiku
- **OpenAI**: o1-pro, o1-mini, GPT-4o
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **DeepSeek**: R1 (latest reasoning model)
- **Qwen**: QWQ-32B Preview (advanced reasoning)

### 🆓 Free Models Available
- Meta Llama 3.1 8B
- Mistral 7B
- Google Gemma 2 9B
- Microsoft Phi-3 Mini
- And more in the "Free Models" section!

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS, PWA-ready, with OpenRouter integration
- **Deployment**: Netlify-optimized with auto-deploy
- **Storage**: Client-side API key storage (secure & private)

## 📁 Project Structure

```
context-engineer/
├── client/                 # PWA Frontend
│   ├── public/
│   │   ├── manifest.json   # PWA manifest
│   │   └── sw.js          # Service worker
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.js         # Main application
│   └── package.json
|
├── netlify.toml           # Netlify configuration
└── README.md
```

## 🔒 Security & Privacy

- **Client-side API keys**: Your OpenRouter API key stays in your browser
- **No data collection**: Zero tracking or analytics
- **HTTPS only**: Secure communication
- **Open source**: Fully auditable code

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for personal or commercial projects!

## 🙏 Support

- ⭐ Star this repo if you find it useful
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features via GitHub Issues
- 🔀 Submit Pull Requests for improvements

---

**Built with ❤️ for the AI community**
