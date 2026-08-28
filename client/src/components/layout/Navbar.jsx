import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

function Navbar() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="navbar">
      <h2>Smart Seat Allocation</h2>

      <div className="nav-right">
        <span>Admin</span>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
