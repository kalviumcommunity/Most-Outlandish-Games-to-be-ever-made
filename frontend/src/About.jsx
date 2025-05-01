import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './About.module.css';

const About = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/games'); // Navigate to the GamesList route
  };

  return (
    <div>
      <h1>Most Outlandish games to be ever made</h1>
      <h2>Welcome</h2>
      <p>A diabolical list of games that are so bad they're good</p>
      <button className={styles.btn} onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default About;