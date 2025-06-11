import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Item Manager</h5>
            <p className="text-muted">
              A simple MERN stack application for managing items
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">© {new Date().getFullYear()} Item Manager</p>
            <p className="text-muted">
              Built with React, Express, MongoDB, and Node.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
