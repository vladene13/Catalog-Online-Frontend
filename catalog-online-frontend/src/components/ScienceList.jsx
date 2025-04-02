import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ScienceList.css";

function ScienceList() {
  const [sciences, setSciences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [className, setClassName] = useState("");
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSciences = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/students/sciences/${classId}`,
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
        setSciences(data);
        setError(null);

        // Fetch the class name if needed
        // This would require another API endpoint to get class details
        // For now, we'll use a placeholder
        setClassName(`Class ${classId}`);
      } catch (err) {
        console.error("Error fetching sciences:", err);
        setError("Failed to load sciences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchSciences();
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
          <p>Loading sciences...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {!loading && !error && sciences.length === 0 && (
        <div className="empty-state">
          <p>No sciences found for this class.</p>
        </div>
      )}

      {!loading && !error && sciences.length > 0 && (
        <div className="science-grid">
          {sciences.map((science) => (
            <div key={science.id} className="science-card">
              <h3>{science.name}</h3>
              <div className="science-actions">
                <button className="view-details-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScienceList;
