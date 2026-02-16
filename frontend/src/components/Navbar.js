import React from 'react';
import { useAuth } from '../App';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>📋 Task Manager</h1>
        <div className="navbar-user">
          <span>Welcome, {user?.name}</span>
          <span className="badge">{user?.role}</span>
          <button onClick={logout} className="btn btn-secondary btn-small">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
