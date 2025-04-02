import { useState, useEffect } from "react";
import AuthPage from "./AuthPage";
import ClassList from "./components/ClassList";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // 'home', 'classes', etc.

  useEffect(() => {
    // Check if user is authenticated (you might want to validate the token with your backend)
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setCurrentPage("home");
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    switch (currentPage) {
      case "classes":
        return <ClassList />;
      default:
        return (
          <div className="welcome-content">
            <h2>Welcome to Catalog Online</h2>
            <p>Please select an option from the navigation menu.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {isAuthenticated && (
        <header className="app-header">
          <h1>Catalog Online</h1>
          <nav>
            <ul className="nav-links">
              <li>
                <button
                  onClick={() => setCurrentPage("home")}
                  className={currentPage === "home" ? "active" : ""}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("classes")}
                  className={currentPage === "classes" ? "active" : ""}
                >
                  Classes
                </button>
              </li>
              {/* Add more navigation items here as needed */}
            </ul>
          </nav>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>
      )}

      <main className="app-main">{renderContent()}</main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Catalog Online</p>
      </footer>
    </div>
  );
}

export default App;
