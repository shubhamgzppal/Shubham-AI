'use client'

interface ChatHeaderProps {
  onMenuClick: () => void;
  onNewChat: () => void;
}

export default function ChatHeader({ onMenuClick, onNewChat }: ChatHeaderProps) {
  return (
    <header className="d-flex align-items-center p-3 border-bottom border-secondary">
      <button 
        onClick={onMenuClick}
        className="btn btn-outline-light me-3"
        aria-label="Menu"
      >
        <i className="bi bi-list"></i>
      </button>
      <h1 className="h5 mb-0 flex-grow-1">AI Chat</h1>
      <button 
        onClick={onNewChat}
        className="btn btn-outline-light"
        aria-label="New Chat"
      >
        <i className="bi bi-plus-lg"></i>
      </button>
    </header>
  );
}
