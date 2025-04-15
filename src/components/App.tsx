import React, { useEffect, useState } from 'react';
import { fetchOdds } from '../api';

const App = () => {
  interface Game {
    home_team: string;
    away_team: string;
  }

  const [odds, setOdds] = useState<Game[]>([]);

  useEffect(() => {
    const getOdds = async () => {
      try {
        
        const data = await fetchOdds();
        setOdds(data);
      } catch (error) {
        console.error('Failed to fetch odds:', error);
      }
    };

    getOdds();
  }, []);

  return (
    <div>
      <h1>NBA Odds</h1>
      <ul>
        {odds.map((game, index) => (
          <li key={index}>
            {game.home_team} vs {game.away_team}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;