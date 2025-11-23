
import React from 'react';
import { MicIcon } from './Icons';

interface RecordButtonProps {
  isRecording: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, onMouseDown, onMouseUp, onTouchStart, onTouchEnd }) => {
  const buttonClasses = `
    relative flex items-center justify-center w-20 h-20 rounded-full 
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-pink-500/50
    ${isRecording 
      ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50' 
      : 'bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/40'
    }
  `;

  return (
    <button
      className={buttonClasses}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <MicIcon className="w-8 h-8 text-white transition-transform duration-200" />
      {isRecording && (
        <span className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></span>
      )}
    </button>
  );
};

export default RecordButton;