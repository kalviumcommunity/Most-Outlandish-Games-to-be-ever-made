import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";

// Fetch games from the backend API
const fetchAllGames = async () => {
  try {
    console.log("Fetching games from API...");
    const response = await fetch("http://localhost:8000/api/AllGames");
    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Received data from API:", data);
    return data;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const data = await fetchAllGames();
        if (data && data.games) {
          setGames(data.games);
          setError(null);
        } else {
          setError("No games data found in response");
        }
      } catch (error) {
        console.error("Error in loadGames:", error);
        setError(error.message || "An error occurred while fetching games");
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Games List</h1>
        <p>Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Games List</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Games List</h1>
      {games.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {games.map((game) => (
            <GameCard
              key={game._id}
              title={game.title}
              description={`${game.genre} game released in ${game.release_year}. ${game.description}`}
              image="https://via.placeholder.com/300"
            />
          ))}
        </div>
      ) : (
        <p>No games found.</p>
      )}
    </div>
  );
};

export default GamesList;