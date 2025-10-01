import React, { useState } from 'react';
import { parseResume } from '../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hi! I\'m your AI Resume Assistant. Please upload a resume file to get started.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  const handleFileUpload = async (uploadedFile) => {
    setLoading(true);
    
    const botMessage = { type: 'bot', content: `Processing ${uploadedFile.name}...` };
    setMessages(prev => [...prev, botMessage]);

    try {
      const response = await parseResume(uploadedFile);
      setResumeData(response.data);
      
      const successMessage = { 
        type: 'bot', 
        content: 'Great! I\'ve analyzed the resume. Here\'s what I found:',
        resumeData: response.data,
        showTable: true
      };
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      const errorMessage = { type: 'bot', content: 'Sorry, I couldn\'t process that file. Please try again with a PDF, PNG, JPG, or JPEG file.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setLoading(true);

    if (!resumeData) {
      const botMessage = { type: 'bot', content: 'Please upload a resume first so I can answer questions about it.' };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentMessage,
          resume_data: resumeData
        }),
      });

      const data = await response.json();
      const botMessage = { type: 'bot', content: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Resume Assistant</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              {message.showTable && message.resumeData && (
                <div className="resume-table">
                  <table>
                    <tbody>
                      <tr>
                        <td><strong>Name</strong></td>
                        <td>{message.resumeData.name || 'Not found'}</td>
                      </tr>
                      <tr>
                        <td><strong>Email</strong></td>
                        <td>{message.resumeData.email || 'Not found'}</td>
                      </tr>
                      <tr>
                        <td><strong>Phone Number</strong></td>
                        <td>{message.resumeData.phone || 'Not found'}</td>
                      </tr>
                      <tr>
                        <td><strong>Skills</strong></td>
                        <td>{message.resumeData.skills?.join(', ') || 'None listed'}</td>
                      </tr>
                      <tr>
                        <td><strong>Years of Experience</strong></td>
                        <td>{message.resumeData.years_experience || 0}</td>
                      </tr>
                      <tr>
                        <td><strong>Education</strong></td>
                        <td>
                          {message.resumeData.education?.map((edu, i) => (
                            <div key={i}>{edu.degree} in {edu.major} from {edu.institution} ({edu.year})</div>
                          )) || 'Not found'}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Current/Last Job</strong></td>
                        <td>
                          {message.resumeData.current_last_job?.title ? (
                            `${message.resumeData.current_last_job.title} at ${message.resumeData.current_last_job.company} (${message.resumeData.current_last_job.start_date} - ${message.resumeData.current_last_job.end_date || 'Present'})`
                          ) : 'Not found'}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Companies Worked At</strong></td>
                        <td>{message.resumeData.companies_worked_at?.join(', ') || 'None listed'}</td>
                      </tr>
                      <tr>
                        <td><strong>LinkedIn</strong></td>
                        <td>{message.resumeData.linkedin || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td><strong>Certifications</strong></td>
                        <td>{message.resumeData.certifications?.join(', ') || 'None listed'}</td>
                      </tr>
                      <tr>
                        <td><strong>Location</strong></td>
                        <td>{message.resumeData.location || 'Not provided'}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="table-footer">
                    You can now ask me questions about this resume!
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        {!resumeData && (
          <div className="file-upload-area">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              id="file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="file-upload-btn">
              📎 Attach Resume
            </label>
          </div>
        )}
        
        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={resumeData ? "Ask about skills, experience, education..." : "Upload a resume first..."}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;