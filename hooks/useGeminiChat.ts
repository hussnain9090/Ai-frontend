import { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/audioUtils';
import { ChatMessage } from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000]; // in ms

export interface GeminiChatSetters {
  setChatHistory: Dispatch<SetStateAction<ChatMessage[]>>;
  setCurrentUserTranscription: Dispatch<SetStateAction<string>>;
  setCurrentModelTranscription: Dispatch<SetStateAction<string>>;
  setIsResponding: Dispatch<SetStateAction<boolean>>;
}

export const useGeminiChat = (
  setters: GeminiChatSetters,
  error: string | null,
  setError: Dispatch<SetStateAction<string | null>>,
  systemInstruction: string
) => {
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);
  const { setChatHistory, setCurrentUserTranscription, setCurrentModelTranscription, setIsResponding } = setters;

  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const userTranscriptionRef = useRef('');
  const modelTranscriptionRef = useRef('');

  const nextStartTimeRef = useRef(0);
  const outputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const retryCountRef = useRef(0);
  const isConnectedRef = useRef(false);

  const resetState = useCallback((clearError = true) => {
    setIsRecording(false);
    setIsResponding(false);
    if (clearError) setError(null);
  }, [setIsResponding, setError]);

  const stopAudioPlayback = () => {
    if (outputSourcesRef.current) {
      for (const source of outputSourcesRef.current.values()) {
        source.stop();
      }
      outputSourcesRef.current.clear();
    }
    nextStartTimeRef.current = 0;
  };

  const cleanup = useCallback(() => {
    isConnectedRef.current = false;
    stopAudioPlayback();

    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current.port.onmessage = null;
      workletNodeRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close().catch(console.error);
    }
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close()).catch(console.error);
      sessionPromiseRef.current = null;
    }
  }, []);

  const handleConnectionError = useCallback(() => {
    cleanup();
    if (retryCountRef.current < MAX_RETRIES) {
      const delay = RETRY_DELAYS[retryCountRef.current];
      retryCountRef.current++;
      setError(`Connection lost. Reconnecting... (${retryCountRef.current}/${MAX_RETRIES})`);
      setTimeout(() => {
        connectToLive(true);
      }, delay);
    } else {
      setError("Failed to reconnect. Please check your network and try again.");
      resetState(false);
    }
  }, [cleanup, setError, resetState]);


  const connectToLive = useCallback((isRetry = false) => {
    if (!isRetry) {
      resetState();
    }

    const apiKey = import.meta.env.VITE_API_KEY as string;
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      setError("Invalid API Key. Please check .env.local");
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    const callbacks = {
      onopen: () => {
        console.log('Session opened.');
        isConnectedRef.current = true;
        retryCountRef.current = 0; // Reset retries on successful connection
        if (isRetry) setError(null); // Clear reconnecting message
      },
      onmessage: async (message: LiveServerMessage) => {
        setIsResponding(true);

        if (message.serverContent?.inputTranscription) {
          const text = message.serverContent.inputTranscription.text;
          userTranscriptionRef.current += text;
          setCurrentUserTranscription(userTranscriptionRef.current);
        }

        if (message.serverContent?.outputTranscription) {
          const text = message.serverContent.outputTranscription.text;
          modelTranscriptionRef.current += text;
          setCurrentModelTranscription(modelTranscriptionRef.current);
        }

        if (message.serverContent?.turnComplete) {
          const fullInput = userTranscriptionRef.current.trim();
          const fullOutput = modelTranscriptionRef.current.trim();

          let finalUserInput = fullInput;
          if (fullInput) {
            try {
              const conversionPrompt = `Convert the following text to Roman Urdu (Urdu written in English letters).
- Preserve the exact Urdu meaning, tone, and emotion.
- Do NOT translate to English.
- Only convert the script to the English alphabet.

Examples:
- Input: 'میں ٹھیک ہوں' -> Output: 'main theek hoon'
- Input: 'کیا کر رہے ہو' -> Output: 'kia kr rahe ho'
- Input: 'I am fine' -> Output: 'main theek hoon'

Text to convert: "${fullInput}"
`;
              const romanUrduResponse = await ai.models.generateContent({
                model: 'gemini-2.0-flash-exp',
                contents: conversionPrompt,
              });
              const convertedText = romanUrduResponse.text?.trim();
              if (convertedText) {
                finalUserInput = convertedText;
              }
            } catch (e) {
              console.error("Failed to convert to Roman Urdu, using original text.", e);
              // Fallback is implicit, as finalUserInput is already fullInput
            }
          }

          setChatHistory(prev => {
            const newHistory = [...prev];
            if (finalUserInput) {
              newHistory.push({ role: 'user', text: finalUserInput, timestamp: Date.now() });
            }
            if (fullOutput) {
              newHistory.push({ role: 'model', text: fullOutput, timestamp: Date.now() });
            }
            return newHistory;
          });

          userTranscriptionRef.current = '';
          modelTranscriptionRef.current = '';
          setCurrentUserTranscription('');
          setCurrentModelTranscription('');
          setIsResponding(false);
        }

        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio && outputAudioContextRef.current) {
          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);

          const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            outputAudioContextRef.current,
            24000,
            1
          );

          const source = outputAudioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(outputAudioContextRef.current.destination);
          source.addEventListener('ended', () => {
            outputSourcesRef.current.delete(source);
          });

          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
          outputSourcesRef.current.add(source);
        }

        if (message.serverContent?.interrupted) {
          stopAudioPlayback();
        }
      },
      onerror: (e: ErrorEvent) => {
        console.error('Session error:', e);
        isConnectedRef.current = false;
        handleConnectionError();
      },
      onclose: (e: CloseEvent) => {
        console.log('Session closed.');
        isConnectedRef.current = false;
        if (!error) {
          resetState();
        }
      },
    };

    sessionPromiseRef.current = ai.live.connect({
      model: 'gemini-2.0-flash-exp',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction,
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    });
  }, [setChatHistory, cleanup, resetState, setCurrentModelTranscription, setCurrentUserTranscription, setIsResponding, setError, handleConnectionError, error, systemInstruction]);

  useEffect(() => {
    // Only create the output context once and reuse it.
    if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    return () => {
      cleanup();
      if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close().catch(console.error);
      }
    };
  }, [cleanup]);

  const startRecording = async () => {
    if (isRecording) return;

    stopAudioPlayback();
    retryCountRef.current = 0; // Reset retries on new user interaction

    if (!sessionPromiseRef.current) {
      connectToLive();
    }

    setIsRecording(true);
    setError(null);

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });

      // Ensure context is running
      if (inputAudioContextRef.current.state === 'suspended') {
        await inputAudioContextRef.current.resume();
      }

      await inputAudioContextRef.current.audioWorklet.addModule('/audio-processor.js');

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);

      workletNodeRef.current = new AudioWorkletNode(inputAudioContextRef.current, 'audio-processor');
      workletNodeRef.current.port.onmessage = (event) => {
        if (!isRecordingRef.current || !isConnectedRef.current) return;

        const inputData = event.data;
        const pcmBlob: Blob = {
          data: encode(new Uint8Array(new Int16Array(inputData.map((x: number) => x * 32768)).buffer)),
          mimeType: 'audio/pcm;rate=16000',
        };

        sessionPromiseRef.current?.then(async (session) => {
          try {
            await session.sendRealtimeInput({ media: pcmBlob });
          } catch (e: any) {
            // Ignore errors if we are closing or if the socket is closed
            if (e.message?.includes('CLOSING') || e.message?.includes('CLOSED')) {
              console.warn("Attempted to send data to closed socket, ignoring.");
              return;
            }
            console.error("Failed to send realtime input:", e);
            if (isRecordingRef.current) {
              handleConnectionError();
            }
          }
        }).catch(e => {
          // Handle session promise rejection
          console.debug("Session promise rejected:", e);
        });
      };

      mediaStreamSourceRef.current.connect(workletNodeRef.current);
      workletNodeRef.current.connect(inputAudioContextRef.current.destination);
    } catch (e) {
      console.error("Error starting recording:", e);
      setError("Could not start recording. Check microphone permissions.");
      setIsRecording(false);
      cleanup();
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;

    setIsRecording(false);

    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current.port.onmessage = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close().catch(console.error);
    }

    if (userTranscriptionRef.current.trim() === '') {
      setIsResponding(false);
    } else {
      setIsResponding(true);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};