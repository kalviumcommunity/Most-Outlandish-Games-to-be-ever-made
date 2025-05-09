import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GamesByUser.css';

const GamesByUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all users when component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/user/allUsers');
                setUsers(response.data.users);
            } catch (error) {
                setError('Failed to fetch users');
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    // Fetch games when a user is selected
    const handleUserChange = async (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        
        if (!userId) {
            setGames([]);
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await axios.get(`http://localhost:8000/api/games-by-user/${userId}`);
            console.log('Games response:', response.data); // Add this for debugging
            setGames(response.data.games || []);
        } catch (error) {
            setError('Failed to fetch games');
            console.error('Error fetching games:', error.response || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="games-by-user-container">
            <h2>Games by User</h2>
            
            <div className="user-select">
                <select 
                    value={selectedUser} 
                    onChange={handleUserChange}
                    className="user-dropdown"
                >
                    <option value="">Select a user</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
                <div className="loading">Loading games...</div>
            ) : (
                <div className="games-grid">
                    {games && games.length > 0 ? (
                        games.map(game => (
                            <div key={game._id} className="game-card">
                                <h3>{game.title}</h3>
                                <p><strong>Genre:</strong> {game.genre}</p>
                                <p><strong>Release Year:</strong> {game.release_year}</p>
                                <p><strong>Description:</strong> {game.description}</p>
                                <p><strong>Created by:</strong> {game.userId?.name || 'Unknown'}</p>
                            </div>
                        ))
                    ) : (
                        selectedUser && <p>No games found for this user.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GamesByUser;
