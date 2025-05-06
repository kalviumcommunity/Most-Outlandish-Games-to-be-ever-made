import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from './About';
import GamesList from './components/GamesList';
import AddGame from './components/AddGame';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/games" element={<GamesList />} />
      <Route path="/add-game" element={<AddGame />} />
    </Routes>
  );
};

export default AllRoutes;