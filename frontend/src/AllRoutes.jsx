import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from './About';
import GamesList from './components/GamesList';
import AddGame from './components/AddGame';
import SignUp from './components/SignUp';
import Login from './components/Login';
import GamesByUser from './components/GamesByUser';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/games" element={<GamesList />} />
      <Route path="/add-game" element={<AddGame />} />
      <Route path="/register" element={<SignUp/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/games-by-user" element={<GamesByUser />} />
    </Routes>
  );
};

export default AllRoutes;