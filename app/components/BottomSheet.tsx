'use client'

interface BottomSheetProps {
  show: boolean;
  onClose: () => void;
}

export default function BottomSheet({ show, onClose }: BottomSheetProps) {
  if (!show) return null;

  return (
    <>
      <div
        className="position-fixed bottom-0 start-0 w-100 bg-dark rounded-top p-3"
        style={{ 
          zIndex: 1045,
          transform: show ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Attach</h5>
          <button 
            onClick={onClose}
            className="btn btn-outline-light"
            aria-label="Close"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="d-flex gap-3">
          <button className="btn btn-outline-light">
            <i className="bi bi-image me-2"></i>
            Image
          </button>
          <button className="btn btn-outline-light">
            <i className="bi bi-file-earmark me-2"></i>
            Document
          </button>
        </div>
      </div>
      
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
        onClick={onClose}
      />
    </>
  )
}
