import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '2rem'
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.2rem'
        }}>
          Home
        </Link>
        <Link to="/games" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.2rem'
        }}>
          Games
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 