const Modal = ({ title, children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{title}</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
