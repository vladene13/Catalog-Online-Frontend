import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import AuthPage from "./AuthPage";
import ClassList from "./components/ClassList";
import StudentList from "./components/StudentList";
import ScienceList from "./components/ScienceList";
import StudentGrades from "./components/StudentGrades";
import "./App.css";

// NavLink component to handle active state
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <li>
      <Link to={to} className={isActive ? "active" : ""}>
        {children}
      </Link>
    </li>
  );
}

// Navigation component
function Navigation({ onLogout }) {
  return (
    <header className="app-header">
      <h1>Catalog Online</h1>
      <nav>
        <ul className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/classes">Classes</NavLink>
        </ul>
      </nav>
      <button onClick={onLogout} className="logout-button">
        Logout
      </button>
    </header>
  );
}

// Main App component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navigation onLogout={handleLogout} />}

        <main className="app-main">
          {!isAuthenticated ? (
            <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <div className="welcome-content">
                    <h2>Welcome to Catalog Online</h2>
                    <p>Please select an option from the navigation menu.</p>
                  </div>
                }
              />
              <Route path="/classes" element={<ClassList />} />
              <Route path="/classes/:classId/students" element={<StudentList />} />
              <Route path="/classes/:classId/sciences" element={<ScienceList />} />
              <Route path="/students/:studentId/sciences/:scienceId/grades" element={<StudentGrades />} />
            </Routes>
          )}
        </main>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Catalog Online</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;