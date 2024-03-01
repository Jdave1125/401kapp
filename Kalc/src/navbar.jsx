import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav>
      <div className='nav-container'>
        {location.pathname === '/view-report' ? (
          <Link to="/" className='navTitle'>Return Home</Link>
        ) : (
          <Link to="/" className='navTitle'>401Kalc</Link>
        )}
        <p className='navP'>
          Calculate your estimated 401k balance at any time
        </p>
      </div>
    </nav>
  );
}

export default Navbar;
