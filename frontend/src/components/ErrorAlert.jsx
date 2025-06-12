import React from 'react';

function ErrorAlert({ message }) {
  return (
    <div className="alert alert-danger" role="alert">
      {message || 'An error occurred'}
    </div>
  );
}

export default ErrorAlert;
