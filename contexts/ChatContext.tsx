import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ChatMessage } from '../types';
import { useGeminiChat, GeminiChatSetters } from '../hooks/useGeminiChat';
import { chuzziInstruction } from '../personas';

interface ChatContextType {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  currentModelTranscription: string;
  currentUserTranscription: string;
  isRecording: boolean;
  isResponding: boolean;
  error: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentModelTranscription, setCurrentModelTranscription] = useState('');
  const [currentUserTranscription, setCurrentUserTranscription] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('chatHistory');
      if (storedHistory) {
        setChatHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
      setError("Failed to load history.");
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } catch (e) {
      console.error("Failed to save chat history to localStorage", e);
      setError("Failed to save history.");
    }
  }, [chatHistory]);

  const setters = useMemo<GeminiChatSetters>(() => ({
    setChatHistory,
    setCurrentModelTranscription,
    setCurrentUserTranscription,
    setIsResponding,
  }), []);

  const { isRecording, startRecording, stopRecording } = useGeminiChat(
    setters,
    error,
    setError,
    chuzziInstruction,
  );
  
  const clearChat = useCallback(() => {
    setChatHistory([]);
    setCurrentModelTranscription('');
    setCurrentUserTranscription('');
    setIsResponding(false);
    setError(null);
    localStorage.removeItem('chatHistory');
  }, []);


  const value = {
    chatHistory,
    setChatHistory,
    currentModelTranscription,
    currentUserTranscription,
    isRecording,
    isResponding,
    error,
    startRecording,
    stopRecording,
    clearChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};