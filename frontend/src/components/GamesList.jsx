import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";

// Fetch games from the backend API
const fetchAllGames = async () => {
  try {
    console.log("Fetching games from API...");
    const response = await fetch("http://localhost:8000/api/AllGames");
    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }
    const data = await response.json();
    console.log("Received data from API:", data);
    return data;
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
        console.log("Data received in component:", data);
        if (data && data.games) {
          console.log("Setting games state with:", data.games);
          setGames(data.games);
        } else {
          console.log("No games data found in response");
          setError("Failed to load games");
        }
      } catch (error) {
        console.error("Error in loadGames:", error);
        setError("An error occurred while fetching games");
      }
    };
    loadGames();
  }, []);

  console.log("Current games state:", games);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Games List</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : games.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {games.map((game) => {
            console.log("Rendering game:", game);
            return (
              <GameCard
                key={game._id}
                title={game.title}
                description={`${game.genre} game released in ${game.release_year}. Available on: ${game.platform.join(', ')}`}
                image={game.image || 'https://via.placeholder.com/300'}
              />
            );
          })}
        </div>
      ) : (
        <p>Loading games...</p>
      )}
    </div>
  );
};

export default GamesList;