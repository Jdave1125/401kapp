// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <div className='nav-container'>
        <Link to="/"  className='navTitle'>401Kalc</Link>
        <p className='navP'>
          Calculate your estimated 401k balance at any time
        </p>
      </div>
    </nav>
  );
}

export default Navbar;
