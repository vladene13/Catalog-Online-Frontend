import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ScienceList.css";

function ScienceList() {
  const [sciences, setSciences] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [className, setClassName] = useState("");
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sciences for the class
        const sciencesResponse = await fetch(
          `http://localhost:5000/api/students/sciences/${classId}`,
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            },
          }
        );

        if (!sciencesResponse.ok) {
          throw new Error(`Error ${sciencesResponse.status}: ${sciencesResponse.statusText}`);
        }

        const sciencesData = await sciencesResponse.json();
        setSciences(sciencesData);

        // Fetch students in the class
        const studentsResponse = await fetch(
          `http://localhost:5000/api/students/school-classes/${classId}`,
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            },
          }
        );

        if (!studentsResponse.ok) {
          throw new Error(`Error ${studentsResponse.status}: ${studentsResponse.statusText}`);
        }

        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
        
        setError(null);
        setClassName(`Class ${classId}`);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchData();
    }
  }, [classId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="science-list-container">
      <div className="science-list-header">
        <button onClick={handleBack} className="back-button">
          &larr; Back to Classes
        </button>
        <h2>Sciences for {className}</h2>
      </div>

      {loading && (
        <div className="loading-spinner">
          <p>Loading data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {sciences.length === 0 ? (
            <div className="empty-state">
              <p>No sciences found for this class.</p>
            </div>
          ) : (
            <>
              <div className="science-grid">
                {sciences.map((science) => (
                  <div key={science.id} className="science-card">
                    <h3>{science.name}</h3>
                    <div className="science-actions">
                      <button 
                        className="view-details-button"
                        onClick={() => {
                          document.getElementById(`students-for-${science.id}`).scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }}
                      >
                        View Student Grades
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {students.length > 0 && sciences.length > 0 && (
                <div className="students-section">
                  <h3>Student Grades by Subject</h3>
                  
                  {sciences.map((science) => (
                    <div key={science.id} id={`students-for-${science.id}`} className="student-science-section">
                      <h4>{science.name}</h4>
                      <div className="students-grid">
                        {students.map((student) => (
                          <div key={`${science.id}-${student.id}`} className="student-card">
                            <p className="student-name">{student.firstName} {student.lastName}</p>
                            <Link 
                              to={`/students/${student.id}/sciences/${science.id}/grades`}
                              className="view-grades-button"
                            >
                              View Grades
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ScienceList;