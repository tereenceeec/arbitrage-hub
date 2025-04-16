import React, { JSX, useEffect, useState } from 'react';
import { fetchH2HOdds, fetchSpreadOdds, fetchTotalOdds, fetchGameIds } from '../api';
import { renderArbitrageBets, Game } from '../components/functions/renderArbitrageBets';
import { renderOdds } from '../components/functions/renderOdds';

const Home = () => {
  
  return (
    <div style={{justifyContent: 'space-around' }}>
        <h2>Home</h2>
        <p>Welcome to the NBA Betting Arbitrage Tool!</p>
        <p>Select an option from the navigation menu to get started.</p>
    </div>
  );
};

export default Home;
