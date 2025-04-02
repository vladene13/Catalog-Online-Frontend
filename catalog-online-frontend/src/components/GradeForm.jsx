import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./GradeForm.css";

function GradeForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentId, scienceId, gradeId } = useParams();
  
  // Get grade data from location state if editing an existing grade
  const gradeToEdit = location.state?.grade;
  const isEditing = !!gradeId;
  
  const [formData, setFormData] = useState({
    studentId: studentId || "",
    scienceId: scienceId || "",
    date: new Date().toISOString().split('T')[0],
    gradeValue: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [scienceName, setScienceName] = useState("");

  // Fetch grade data if editing
  useEffect(() => {
    // Set student and science names from location state
    setStudentName(location.state?.studentName || "Student");
    setScienceName(location.state?.scienceName || "Science");

    // If editing, fetch the grade data
    if (isEditing && gradeId) {
      const fetchGrade = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:5000/api/school-classes/grades/${gradeId}`,
            {
              headers: {
                Accept: "*/*",
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            }
          );

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Fetched grade data:", data);
          
          setFormData({
            studentId: studentId || "",
            scienceId: scienceId || "",
            date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
            gradeValue: data.gradeValue || ""
          });
          
        } catch (err) {
          console.error("Error fetching grade:", err);
          setError("Failed to load grade data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchGrade();
    }
  }, [isEditing, gradeId, studentId, scienceId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!formData.gradeValue) {
      setError("Grade value is required");
      setLoading(false);
      return;
    }

    try {
      // Create the payload according to API format
      const payload = {
        studentId: formData.studentId,
        scienceId: formData.scienceId,
        date: formData.date,
        gradeValue: formData.gradeValue
      };

      // If editing, include the ID
      if (isEditing && gradeId) {
        payload.id = gradeId;
      }

      console.log("Sending payload:", payload);

      // Make the API request
      const response = await fetch(
        "http://localhost:5000/api/school-classes/grades",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to ${isEditing ? "update" : "add"} grade`);
      }

      setSuccess(`Grade successfully ${isEditing ? "updated" : "added"}!`);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
      
    } catch (err) {
      console.error("Error saving grade:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !gradeId) return;
    
    if (!window.confirm("Are you sure you want to delete this grade?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/school-classes/grades/${gradeId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error("Failed to delete grade");
      }

      setSuccess("Grade successfully deleted!");
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
      
    } catch (err) {
      console.error("Error deleting grade:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="grade-form-container">
      <div className="grade-form-header">
        <button onClick={handleCancel} className="back-button">
          ← Back
        </button>
        <h2>{isEditing ? "Edit" : "Add"} Grade for {studentName}</h2>
      </div>

      <div className="grade-form-card">
        <div className="grade-subject-info">
          <p>
            <strong>Student:</strong> {studentName}
          </p>
          <p>
            <strong>Subject:</strong> {scienceName}
          </p>
        </div>

        {loading && !error ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="grade-form">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gradeValue">Grade Value</label>
              <input
                type="text"
                id="gradeValue"
                name="gradeValue"
                value={formData.gradeValue}
                onChange={handleChange}
                required
                placeholder="Enter a grade (1-10)"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="delete-button"
                  disabled={loading}
                >
                  Delete
                </button>
              )}
              
              <button
                type="submit"
                className="save-button"
                disabled={loading}
              >
                {loading ? "Saving..." : isEditing ? "Update" : "Add Grade"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default GradeForm;