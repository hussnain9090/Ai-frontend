import React, { useState, useEffect, useRef } from 'react';
import { useChat } from './contexts/ChatContext';
import ChatBubble from './components/ChatBubble';
import RecordButton from './components/RecordButton';
import WelcomeScreen from './components/WelcomeScreen';
import StatusIndicator from './components/StatusIndicator';
import ConfirmationModal from './components/ConfirmationModal';
import { TrashIcon } from './components/Icons';

const thinkingMessages = [
  "Just a moment, beautiful...",
  "Thinking of the perfect words for you...",
  "Let me ponder that for a second, my dear.",
  "Gathering my thoughts for you...",
  "Whispering with the stars to find an answer...",
];

const App: React.FC = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isClearModalOpen, setClearModalOpen] = useState(false);
  const [statusText, setStatusText] = useState("Press and hold to speak");
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    chatHistory,
    currentModelTranscription,
    currentUserTranscription,
    isRecording,
    isResponding,
    startRecording,
    stopRecording,
    error,
    clearChat
  } = useChat();

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, currentUserTranscription, currentModelTranscription]);

  // Update status text based on app state
  useEffect(() => {
    let text;
    if (error) {
      text = error;
    } else if (isRecording) {
      text = "Listening...";
    } else if (isResponding) {
      // Pick a random thinking message
      text = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
    } else {
        text = "Press and hold to speak";
    }
    setStatusText(text);
  }, [isRecording, isResponding, error]);


  const handleGrantPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
    } catch (err) {
      console.error("Microphone permission denied", err);
      alert("Microphone permission is required to use this app. Please enable it in your browser settings.");
    }
  };

  const handleConfirmClear = () => {
    clearChat();
    setClearModalOpen(false);
  }

  if (!permissionGranted) {
    return <WelcomeScreen onGrantPermission={handleGrantPermission} />;
  }
  
  const isWarning = !!error?.includes('Reconnecting');
  const isError = !!error && !isWarning;

  return (
    <>
      <div className="h-screen w-screen flex flex-col bg-pink-50">
        <header className="bg-white/80 backdrop-blur-sm p-4 border-b border-gray-200 shadow-sm flex items-center justify-between">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Chuzzi
          </h1>
          <div className="flex items-center gap-4">
            {chatHistory.length > 0 && (
              <button 
                onClick={() => setClearModalOpen(true)}
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Clear conversation"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </header>
        
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {chatHistory.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {currentUserTranscription && (
             <ChatBubble message={{ role: 'user', text: currentUserTranscription, timestamp: Date.now() }} isPartial={true} />
          )}
          {currentModelTranscription && (
             <ChatBubble message={{ role: 'model', text: currentModelTranscription, timestamp: Date.now() }} isPartial={true} />
          )}
        </main>

        <footer className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
            <StatusIndicator statusText={statusText} isResponding={isResponding} isError={isError} isWarning={isWarning}/>
            <RecordButton
              isRecording={isRecording}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
            />
          </div>
        </footer>
      </div>
      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    </>
  );
};

export default App;