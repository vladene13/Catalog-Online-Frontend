import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./StudentGrades.css";

function StudentGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [scienceName, setScienceName] = useState("");
  const { studentId, scienceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        
        // Fetch the student's grades for the specific science
        const response = await fetch(
          `http://localhost:5000/api/school-classes/grades/${studentId}/${scienceId}`,
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setGrades(Array.isArray(data) ? data : [data]); // Ensure we have an array even if single object
        setError(null);
        
        // In a real app, you might want to fetch the student name and science name
        // from separate API endpoints. For now, we'll use placeholders
        setStudentName("Student");
        setScienceName("Science");
        
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError("Failed to load grades. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (studentId && scienceId) {
      fetchGrades();
    }
  }, [studentId, scienceId]);

  const handleBack = () => {
    navigate(-1);
  };

  // Format the date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="grades-container">
      <div className="grades-header">
        <button onClick={handleBack} className="back-button">
          &larr; Back
        </button>
        <h2>{studentName}'s Grades for {scienceName}</h2>
      </div>

      {loading && (
        <div className="loading-spinner">
          <p>Loading grades...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {!loading && !error && grades.length === 0 && (
        <div className="empty-state">
          <p>No grades found for this student in this subject.</p>
        </div>
      )}

      {!loading && !error && grades.length > 0 && (
        <div className="grades-card">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{formatDate(grade.date)}</td>
                  <td>{grade.scienceName || scienceName}</td>
                  <td className="grade-value">{grade.gradeValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentGrades;