import React from 'react';

const LoadingSpinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading">
      Processing your resume... This may take a few moments.
    </div>
  );
};

export default LoadingSpinner;