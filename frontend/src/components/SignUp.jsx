import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    
    // Check if user is already logged in
    useEffect(() => {
        const userData = localStorage.getItem('user-asap');
        if (userData) {
            navigate('/games');
        }
    }, [navigate]);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post("http://localhost:8000/user/register", user);
            console.log(response.data);
            
            // If registration automatically logs in the user
            if (response.data.user) {
                localStorage.setItem('user-asap', JSON.stringify(response.data.user));
                if (response.data.token) {
                    localStorage.setItem('token-asap', response.data.token);
                }
                navigate('/games');
            } else {
                // If registration doesn't auto-login, redirect to login page
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Registration failed!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        required 
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required 
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}

export default SignUp