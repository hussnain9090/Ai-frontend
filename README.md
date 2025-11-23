# AI Girlfriend - Frontend

A modern, responsive web interface for the AI Girlfriend application featuring a premium glassmorphism design with real-time chat, voice interaction, and dynamic mood-based responses.

## 🔗 Related Repository

**Backend Repository**: [hussnain9090/Ai-backend](https://github.com/hussnain9090/Ai-backend) _(Coming soon)_

## ✨ Features

- 💬 Real-time chat interface with typing animations
- 🎤 Voice input support (Speech-to-Text)
- 🔊 AI voice responses (Text-to-Speech)
- 🎨 Premium glassmorphism UI design
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🌐 Multi-language support (English + Roman Urdu)
- 😊 Mood-based interactions
- 💾 Conversation memory

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hussnain9090/Ai-frontend.git
cd Ai-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Google Gemini API key:
   - Create a `.env.local` file in the root directory
   - Add your API key: `API_KEY=your_gemini_api_key_here`

4. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🔧 Configuration

### Google Gemini API Setup

This application uses Google Gemini API directly from the frontend for AI chat and voice features.

Create a `.env.local` file in the root directory:

```env
API_KEY=your_gemini_api_key_here
```

**Get your API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### Environment Variables

- `API_KEY` - Google Gemini API key (required)
- `VITE_APP_NAME` - Application name (optional)

## 📁 Project Structure

```
client/
├── src/
│   ├── App.tsx                    # Main application component
│   ├── index.tsx                  # Entry point
│   ├── types.ts                   # TypeScript type definitions
│   ├── personas.ts                # AI personality configurations
│   ├── components/                # React components
│   │   ├── ChatBubble.tsx
│   │   ├── RecordButton.tsx
│   │   ├── PersonaSwitcher.tsx
│   │   └── ...
│   ├── hooks/                     # Custom React hooks
│   │   └── useGeminiChat.ts      # Gemini API integration
│   ├── contexts/                  # React contexts
│   │   └── ChatContext.tsx
│   └── services/                  # Utility services
│       └── audioUtils.ts
├── public/                        # Static assets
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
└── README.md                      # This file
```

## 🌐 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Deploy to GitHub Pages

1. Update `package.json` with homepage URL
2. Run: `npm run build`
3. Deploy the `dist` folder to GitHub Pages

## 🔒 Security Notes

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Enable CORS properly on the backend
- Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

[Your License Here]

## 🐛 Known Issues

- Voice input requires HTTPS in production
- Some browsers may require user interaction before playing audio

## 📞 Support

For issues related to:
- **Frontend/UI**: Open an issue in this repository
- **Backend/API**: Open an issue in the backend repository
