import React from 'react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="state-box">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}