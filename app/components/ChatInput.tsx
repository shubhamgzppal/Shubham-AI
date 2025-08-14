'use client'

import { useState, useRef } from 'react'

interface ModelOption {
  label: string;
  value: string;
}

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onGenerateImage: (prompt: string, imageFile?: File) => void;
  onAttachClick: () => void;
  selectedModel: ModelOption;
  onModelChange: (model: ModelOption) => void;
}

export default function ChatInput({ 
  onSendMessage, 
  onGenerateImage, 
  onAttachClick,
  selectedModel,
  onModelChange 
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (selectedModel.value.includes('image')) {
      onGenerateImage(input.trim())
    } else {
      onSendMessage(input.trim())
    }
    
    setInput('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-top border-secondary">
      <div className="input-group">
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={onAttachClick}
          aria-label="Attach"
        >
          <i className="bi bi-paperclip"></i>
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-control bg-dark text-white"
          placeholder={selectedModel.value.includes('image') ? "Describe the image you want to generate..." : "Type your message..."}
          rows={1}
          style={{ resize: 'none' }}
          spellCheck={false}
          autoComplete="off"
          data-ms-editor="false"
          suppressHydrationWarning
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!input.trim()}
        >
          <i className="bi bi-send"></i>
        </button>
      </div>
    </form>
  )
}
