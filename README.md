# AI Girlfriend - Frontend Client

This is the frontend React application for the AI Girlfriend app, built with Vite, React, TypeScript, and Tailwind CSS.

## Features

- 🎙️ Voice interaction with AI
- 💬 Real-time chat interface
- 🎨 Beautiful glassmorphism design
- 🌐 Multi-language support (English + Roman Urdu)
- 🧠 Context-aware AI responses
- 🎭 Multiple AI personas

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the client directory:
```
API_KEY=your_gemini_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

To create a production build:
```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment on Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and set your environment variables

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set the following:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `API_KEY` with your Gemini API key
6. Deploy!

### Important: Environment Variables

Make sure to add the following environment variable in Vercel:
- `API_KEY` - Your Google Gemini API key

## Project Structure

```
client/
├── components/       # React components
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── services/        # Utility services
├── public/          # Static assets
├── App.tsx          # Main app component
├── index.tsx        # Entry point
├── index.css        # Global styles
├── personas.ts      # AI personality configurations
└── types.ts         # TypeScript type definitions
```

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI model
- **Web Audio API** - Voice processing

## Notes

- The app uses the Gemini Live API for real-time voice interactions
- Make sure your browser supports the Web Audio API
- Microphone permissions are required for voice features
