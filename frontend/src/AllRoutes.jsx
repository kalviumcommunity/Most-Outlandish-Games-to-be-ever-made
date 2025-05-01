import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from './About';
import GamesList from './components/GamesList';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/games" element={<GamesList />} />
    </Routes>
  );
};

export default AllRoutes;