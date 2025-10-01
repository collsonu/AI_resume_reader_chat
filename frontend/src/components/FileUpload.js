const FileUpload = ({ file, onFileChange, onUpload, loading }) => {
  return (
    <div className="upload-section">
      <h2>Upload Resume</h2>
      <p>Upload a PDF, PNG, JPG, or JPEG file to extract resume information</p>
      
      <div className="file-input">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={onFileChange}
        />
      </div>
      
      <button
        className="upload-btn"
        onClick={onUpload}
        disabled={loading || !file}
      >
        {loading ? 'Processing...' : 'Parse Resume'}
      </button>
    </div>
  );
};

export default FileUpload;