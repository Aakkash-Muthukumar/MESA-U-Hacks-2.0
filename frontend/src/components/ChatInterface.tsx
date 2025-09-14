import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Upload, Image, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCard } from '@/components/MessageCard';
import { TypingIndicator } from '@/components/TypingIndicator';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  subject?: string;
  hasSteps?: boolean;
  hasCode?: boolean;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: "🌟 Welcome to your STEM Tutor! I'm here to help you master mathematics, coding, physics, biology, chemistry, and engineering. What would you like to explore today?",
    timestamp: new Date(),
    subject: 'welcome'
  },
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getSimulatedResponse(inputValue),
        timestamp: new Date(),
        hasSteps: Math.random() > 0.5,
        hasCode: inputValue.toLowerCase().includes('code') || inputValue.toLowerCase().includes('program'),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const getSimulatedResponse = (input: string): string => {
    const responses = [
      "Great question! Let me break this down step by step for you. This is a fundamental concept that builds on what we've learned before.",
      "I can help you with that! This is an excellent opportunity to explore the underlying principles. Let's start with the basics.",
      "Perfect! This connects to several important concepts in STEM. Let me show you different ways to approach this problem.",
      "Interesting challenge! I love how you're thinking about this. Let me guide you through the solution process.",
      "This is a classic problem that appears frequently. Understanding it will help you tackle similar challenges in the future."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice Input",
        description: "Voice input would be activated here with proper speech recognition.",
      });
    }
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload functionality would allow you to share code, images, or documents.",
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs focus-ring"
              onClick={() => setInputValue("Explain quadratic equations")}
            >
              Explain quadratic equations
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs focus-ring"
              onClick={() => setInputValue("Help me debug this Python code")}
            >
              Debug Python code
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs focus-ring"
              onClick={() => setInputValue("What is photosynthesis?")}
            >
              What is photosynthesis?
            </Button>
          </div>
          
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                id="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about STEM subjects..."
                className="min-h-[44px] max-h-32 resize-none focus-ring pr-20"
                aria-label="Chat input"
              />
              
              <div className="absolute right-2 bottom-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 focus-ring"
                  onClick={handleFileUpload}
                  aria-label="Upload file"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 focus-ring ${isListening ? 'text-red-500' : ''}`}
                  onClick={handleVoiceInput}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="btn-cosmic h-11 px-6 focus-ring"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};