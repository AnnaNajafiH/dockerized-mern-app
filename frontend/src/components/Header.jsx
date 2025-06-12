import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-dark text-white p-0 shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-boxes me-2"></i>
            <span>Item Manager</span>
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={() => setIsExpanded(false)}
                >
                  <i className="bi bi-house-door me-1"></i> Home
                </Link>
              </li>
            </ul>
            <Link 
              to="/items/new" 
              className="btn btn-success ms-lg-3"
              onClick={() => setIsExpanded(false)}
            >
              <i className="bi bi-plus"></i> Add Item
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;