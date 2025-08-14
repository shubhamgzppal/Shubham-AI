'use client'

interface ModelOption {
  label: string;
  value: string;
}

interface SidebarProps {
  show: boolean;
  onClose: () => void;
  user: { name: string; email?: string } | null;
  onLogin: () => void;
  onLogout: () => void;
  onSignup: () => void;
  chats: Array<{ id: string; title: string }>;
  onUserChange: (user: { name: string; email?: string } | null) => void;
  onSelectChat: (id: string) => void;
  models: ModelOption[];
  selectedModel: ModelOption;
  onModelChange: (model: ModelOption) => void;
}

export default function Sidebar({
  show,
  onClose,
  user,
  onLogin,
  onLogout,
  onSignup,
  chats,
  onUserChange,
  onSelectChat,
  models,
  selectedModel,
  onModelChange
}: SidebarProps) {
  return (
    <>
      <div 
        className={`position-fixed top-0 start-0 h-100 bg-dark p-3 ${show ? 'translate-start' : 'translate-start-100'}`}
        style={{ 
          width: '280px', 
          zIndex: 1045,
          transform: show ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Menu</h5>
          <button 
            onClick={onClose}
            className="btn btn-outline-light"
            aria-label="Close"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="mb-3">
          <select 
            className="form-select bg-dark text-white"
            value={selectedModel.value}
            onChange={(e) => {
              const model = models.find(m => m.value === e.target.value)
              if (model) onModelChange(model)
            }}
          >
            {models.map(model => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        {user ? (
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <div className="me-2">
                <i className="bi bi-person-circle"></i>
              </div>
              <div>
                <div>{user.name}</div>
                {user.email && <div className="small text-muted">{user.email}</div>}
              </div>
            </div>
            <button 
              onClick={() => {
                onLogout()
                onUserChange(null)
              }}
              className="btn btn-outline-light btn-sm w-100"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mb-3">
            <button 
              onClick={onLogin}
              className="btn btn-outline-light btn-sm w-100 mb-2"
            >
              Sign In
            </button>
            <button 
              onClick={onSignup}
              className="btn btn-primary btn-sm w-100"
            >
              Sign Up
            </button>
          </div>
        )}

        {chats.length > 0 && (
          <div className="mt-4">
            <h6 className="mb-2">Recent Chats</h6>
            <div className="list-group list-group-flush">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className="list-group-item list-group-item-action bg-transparent text-white border-secondary"
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={onClose}
        />
      )}
    </>
  )
}
