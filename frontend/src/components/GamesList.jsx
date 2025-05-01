import React, { useEffect, useState } from "react";

// Fetch games from the backend API
const fetchAllGames = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/AllGames");
    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching games:", error);
    return null;
  }
};

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchAllGames();
        if (data && data.games) {
          setGames(data.games);
        } else {
          setError("Failed to load games");
        }
      } catch (err) {
        setError("An error occurred while fetching games");
      }
    };
    loadGames();
  }, []);

  return (
    <div>
      <h1>Games List</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : games.length > 0 ? (
        <ul>
          {games.map((game) => (
            <li key={game._id}>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <p>
                <strong>Genre:</strong> {game.genre}
              </p>
              <p>
                <strong>Release Year:</strong> {game.release_year}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading games...</p>
      )}
    </div>
  );
};

export default GamesList;