import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddGame.module.css';

const AddGame = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    release_year: '',
    genre: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'release_year' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user-asap"));
    if (!userData || !userData._id) {
      setError("Please login first");
      navigate('/login');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/AddGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: userData._id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add game');
      }

      // Reset form and navigate to games list
      setFormData({ title: '', release_year: '', genre: '', description: '' });
      navigate('/games');
    } catch (error) {
      setError(error.message || 'Error adding game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add New Game</h1>
      
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="Enter game title"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="release_year">Release Year:</label>
          <input
            type="number"
            id="release_year"
            name="release_year"
            value={formData.release_year}
            onChange={handleInputChange}
            min="1950"
            max={new Date().getFullYear()}
            required
            className={styles.input}
            placeholder="Enter release year"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="Enter game genre"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className={styles.textarea}
            placeholder="Enter game description"
            rows="4"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Adding Game...' : 'Add Game'}
          </button>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate('/games')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;