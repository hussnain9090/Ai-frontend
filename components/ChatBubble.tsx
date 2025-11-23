
import React from 'react';
import { ChatMessage, Role } from '../types';
import { UserIcon, SparklesIcon } from './Icons';

interface ChatBubbleProps {
  message: ChatMessage;
  isPartial?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isPartial = false }) => {
  const { role, text, timestamp } = message;
  const isUser = role === 'user';

  const bubbleClasses = isUser
    ? 'bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white rounded-br-none'
    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none';
  
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-end gap-2 animate-fade-in-up ${containerClasses}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <div className={`max-w-md md:max-w-2xl p-4 rounded-xl shadow-md ${bubbleClasses} ${isPartial ? 'opacity-70' : ''}`}>
        <p className="whitespace-pre-wrap">{text}</p>
        {!isPartial && (
          <p className={`text-xs mt-2 ${isUser ? 'text-pink-100' : 'text-gray-500'} text-right`}>
            {formatTimestamp(timestamp)}
          </p>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;