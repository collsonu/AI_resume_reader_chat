import React from 'react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="error">
      {error}
    </div>
  );
};

export default ErrorMessage;