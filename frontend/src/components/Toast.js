import React, { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`toast toast-${type}`} role="alert">
      {message}
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">&times;</button>
    </div>
  );
}