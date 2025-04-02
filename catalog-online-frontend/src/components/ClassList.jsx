import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ClassList.css";

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/school-classes",
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
        setClasses(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const renderClassCard = (classItem) => (
    <div key={classItem.id} className="class-card">
      <h3>{classItem.name}</h3>
      <p>Year: {classItem.year}</p>
      <div className="class-actions">
        <Link to={`/classes/${classItem.id}/students`} className="view-button">
          View Students
        </Link>
      </div>
    </div>
  );

  return (
    <div className="class-list-container">
      <h2>School Classes</h2>

      {loading && (
        <div className="loading-spinner">
          <p>Loading classes...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {!loading && !error && classes.length === 0 && (
        <div className="empty-state">
          <p>No classes found.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="class-grid">{classes.map(renderClassCard)}</div>
      )}
    </div>
  );
}

export default ClassList;
