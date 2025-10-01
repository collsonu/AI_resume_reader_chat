import React from 'react';

const ResultsTable = ({ results }) => {
  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) return 'None';
    return (
      <div className="skills-list">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
    );
  };

  const renderEducation = (education) => {
    if (!education || education.length === 0) return 'None';
    return education.map((edu, index) => (
      <div key={index}>
        {edu.degree} in {edu.major} from {edu.institution} ({edu.year})
      </div>
    ));
  };

  const renderCompanies = (companies) => {
    if (!companies || companies.length === 0) return 'None';
    return companies.join(', ');
  };

  const renderCertifications = (certifications) => {
    if (!certifications || certifications.length === 0) return 'None';
    return certifications.join(', ');
  };

  return (
    <div className="results-section">
      <h2>Extracted Resume Information</h2>
      <table className="results-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{results.name || 'Not found'}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{results.email || 'Not found'}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{results.phone || 'Not found'}</td>
          </tr>
          <tr>
            <th>Location</th>
            <td>{results.location || 'Not found'}</td>
          </tr>
          <tr>
            <th>Years of Experience</th>
            <td>{results.years_experience || 0}</td>
          </tr>
          <tr>
            <th>Skills</th>
            <td>{renderSkills(results.skills)}</td>
          </tr>
          <tr>
            <th>Current/Last Job</th>
            <td>
              {results.current_last_job?.title ? (
                <div>
                  <strong>{results.current_last_job.title}</strong> at {results.current_last_job.company}
                  <br />
                  {results.current_last_job.start_date} - {results.current_last_job.end_date || 'Present'}
                </div>
              ) : 'Not found'}
            </td>
          </tr>
          <tr>
            <th>Companies Worked At</th>
            <td>{renderCompanies(results.companies_worked_at)}</td>
          </tr>
          <tr>
            <th>Education</th>
            <td>{renderEducation(results.education)}</td>
          </tr>
          <tr>
            <th>LinkedIn</th>
            <td>{results.linkedin || 'Not found'}</td>
          </tr>
          <tr>
            <th>Certifications</th>
            <td>{renderCertifications(results.certifications)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;