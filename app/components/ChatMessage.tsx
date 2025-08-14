'use client'

import { Message } from '../types/chat'

interface ChatMessageProps {
  message: Message;
  onSendMessage: (content: string) => void;
}

export default function ChatMessage({ message, onSendMessage }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`p-3 rounded-3 ${isUser ? 'bg-primary' : 'bg-secondary'}`} style={{ maxWidth: '75%' }}>
        <div className="mb-1">
          {message.content}
        </div>
        {message.imageUrl && (
          <div className="mt-2">
            <img 
              src={message.imageUrl} 
              alt="Generated" 
              className="img-fluid rounded"
              style={{ maxWidth: '100%' }}
            />
          </div>
        )}
        <div className="text-white-50 small mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
