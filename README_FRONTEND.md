# AI Girlfriend - Frontend

A modern, responsive web interface for the AI Girlfriend application featuring a premium glassmorphism design with real-time chat, voice interaction, and dynamic mood-based responses.

## 🔗 Related Repository

**Backend Repository**: [Link to your backend repository here]

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
git clone https://github.com/YOUR_USERNAME/ai-gf-frontend.git
cd ai-gf-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the backend API URL:
   - Open `script.js`
   - Update the `API_BASE_URL` to point to your backend server

4. Start the development server:
```bash
npm start
```

Or simply open `index.html` in your browser for local development.

## 🔧 Configuration

### Backend Connection

Update the API endpoint in `script.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000'; // Change to your backend URL
```

### Environment Variables

For production deployment, you may want to use environment variables:

- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name

## 📁 Project Structure

```
client/
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── script.js           # Frontend logic and API calls
├── package.json        # Dependencies
└── README.md           # This file
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
