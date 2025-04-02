import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AuthPage from "./AuthPage";
import ClassList from "./components/ClassList";
import StudentList from "./components/StudentList";
import "./App.css";

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

  const renderNavbar = () => {
    if (!isAuthenticated) return null;

    return (
      <header className="app-header">
        <h1>Catalog Online</h1>
        <nav>
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/classes"
                className={
                  location.pathname.includes("/classes") ? "active" : ""
                }
              >
                Classes
              </Link>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
    );
  };

  return (
    <Router>
      <div className="app-container">
        {renderNavbar()}

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
              <Route
                path="/classes/:classId/students"
                element={<StudentList />}
              />
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
