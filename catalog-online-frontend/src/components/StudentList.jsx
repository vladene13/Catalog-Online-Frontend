import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./StudentList.css";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [className, setClassName] = useState("");
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/students/school-classes/${classId}`,
          {
            headers: {
              Accept: "*/*",
              // Add authorization header if needed
              // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setStudents(data);
        setError(null);

        // Fetch the class name if needed
        // This would require another API endpoint to get class details
        // For now, we'll use a placeholder
        setClassName(`Class ${classId}`);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchStudents();
    }
  }, [classId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <button onClick={handleBack} className="back-button">
          &larr; Back to Classes
        </button>
        <h2>Students in {className}</h2>
      </div>

      {loading && (
        <div className="loading-spinner">
          <p>Loading students...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <div className="empty-state">
          <p>No students found in this class.</p>
        </div>
      )}

      {!loading && !error && students.length > 0 && (
        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;
