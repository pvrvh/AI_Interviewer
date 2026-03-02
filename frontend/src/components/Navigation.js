import React from 'react';
import { Link } from 'react-router-dom';

function Navigation({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>AI Interview Prep</h1>
        
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/interviews">Interviews</Link></li>
          <li><Link to="/analytics">Analytics</Link></li>
          <li>
            <button onClick={onLogout} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>
              Logout ({user?.username})
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
