import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.link}>
          Home
        </Link>
        <Link to="/games" className={styles.link}>
          Games
        </Link>
        <Link to="/add-game" className={styles.link}>
          Add Game
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 