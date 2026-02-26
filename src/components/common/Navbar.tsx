import { NavLink } from "react-router-dom";
import "./navbar.css";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Logistics Demo</div>

      <div className="navbar-links">
        <NavLink
          to="/shipments"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Shipments
        </NavLink>

        <NavLink
          to="/assignments"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Assignments
        </NavLink>
      </div>
    </nav>
  );
}
