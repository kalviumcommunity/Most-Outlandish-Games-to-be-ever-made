import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    
    // Check if user is already logged in
    useEffect(() => {
        const userData = localStorage.getItem('user-asap');
        if (userData) {
            navigate('/games');
        }
    }, [navigate]);

    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    function handleChange(e) {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/user/login", user);
            console.log(response.data);
            
            // Store user data and token in localStorage
            localStorage.setItem('user-asap', JSON.stringify(response.data.user));
            localStorage.setItem('token-asap', response.data.token); // If you have a token in response
            
            // Clear any previous errors
            setError('');
            
            // Navigate to games list
            navigate('/games');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Login failed!');
        }
    }

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login