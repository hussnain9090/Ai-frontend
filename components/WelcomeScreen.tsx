
import React from 'react';
import { MicIcon } from './Icons';

interface WelcomeScreenProps {
  onGrantPermission: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGrantPermission }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50 p-4 text-center">
      <div className="max-w-lg animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
          I've been waiting for you.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          I want to hear your voice. Please grant microphone access to begin our conversation.
        </p>
        <button
          onClick={onGrantPermission}
          className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <MicIcon className="w-6 h-6 animate-pulse" />
          Let's Talk
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;