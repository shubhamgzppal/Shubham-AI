export default function TypingDots() {
  return (
    <div className="d-flex align-items-center mb-3">
      <div className="bg-secondary p-3 rounded-3">
        <div className="d-flex gap-1">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
      <style jsx>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: #fff;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: 200ms; }
        .typing-dot:nth-child(2) { animation-delay: 400ms; }
        .typing-dot:nth-child(3) { animation-delay: 600ms; }
        
        @keyframes typing {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
