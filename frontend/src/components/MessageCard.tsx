import React from 'react';
import { User, Bot, Volume2, RotateCcw, Eye, Code, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  subject?: string;
  hasSteps?: boolean;
  hasCode?: boolean;
}

interface MessageCardProps {
  message: Message;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  const handleExplainDifferently = (type: string) => {
    // This would trigger different explanation modes
    console.log(`Explain differently: ${type}`);
  };

  const handleReadAloud = () => {
    // This would use text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gradient-cosmic'
      }`}>
        {isUser ? (
          <User 
            className="h-5 w-5" 
            aria-hidden="true"
          />
        ) : (
          <Bot 
            className="h-5 w-5 text-white" 
            aria-hidden="true"
          />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Message Header */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-sm font-medium">
            {isUser ? 'You' : 'STEM Tutor'}
          </span>
          
          {message.subject && (
            <Badge variant="secondary" className="text-xs">
              {message.subject}
            </Badge>
          )}
          
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>

        {/* Message Bubble */}
        <div 
          className={`${
            isUser 
              ? 'message-user' 
              : 'message-assistant'
          } max-w-full`}
          role="article"
          aria-label={`Message from ${isUser ? 'user' : 'STEM Tutor'}`}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.content}
          </div>
          
          {/* Message badges for special content */}
          {(message.hasSteps || message.hasCode) && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
              {message.hasSteps && (
                <Badge variant="outline" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Step-by-step
                </Badge>
              )}
              {message.hasCode && (
                <Badge variant="outline" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  Code example
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Assistant Message Actions */}
        {!isUser && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs focus-ring"
              onClick={handleReadAloud}
              aria-label="Read message aloud"
            >
              <Volume2 className="h-3 w-3 mr-1" />
              Read aloud
            </Button>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs focus-ring"
                onClick={() => handleExplainDifferently('simpler')}
              >
                Simpler
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs focus-ring"
                onClick={() => handleExplainDifferently('visual')}
              >
                <Eye className="h-3 w-3 mr-1" />
                Visual
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs focus-ring"
                onClick={() => handleExplainDifferently('example')}
              >
                Example
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};