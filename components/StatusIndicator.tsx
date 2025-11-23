
import React from 'react';
import { LoadingSpinner, AlertIcon } from './Icons';

interface StatusIndicatorProps {
  statusText: string;
  isResponding: boolean;
  isError: boolean;
  isWarning: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ statusText, isResponding, isError, isWarning }) => {
  const isApiKeyError = statusText?.includes("Invalid API Key");

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${isApiKeyError ? 'bg-red-100 text-red-700 border border-red-200' :
        isError ? 'bg-red-50 text-red-600' :
          isResponding ? 'bg-purple-100 text-purple-700 animate-pulse' :
            'bg-gray-100 text-gray-600'
      }`}>
      {isApiKeyError ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          API Key Missing
        </span>
      ) : isResponding ? (
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
        </div>
      ) : (
        <span className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : 'bg-green-500'}`} />
      )}
      <span>{statusText}</span>
    </div>
  );
}

export default StatusIndicator;