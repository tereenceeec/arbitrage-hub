import React, { useEffect, useState } from 'react';
import { fetchGameIds, fetchPlayerPropsForGame } from '../api';
import { renderPlayerPropsArbitrageBets } from '../components/functions/renderPlayerPropsArbitrage';

const PlayerPropsAssists = () => {
  const [playerProps, setPlayerProps] = useState<any[]>([]);

  useEffect(() => {
    const loadPlayerProps = async () => {
      try {
        const ids = await fetchGameIds();

        // Fetch all player props in parallel for each game
        const propPromises = ids.map((id) => fetchPlayerPropsForGame(id));
        const propsData = await Promise.all(propPromises);

        setPlayerProps(propsData);
        console.log('All player props:', propsData);
      } catch (error) {
        console.error('Failed to fetch player props:', error);
      }
    };

    loadPlayerProps();
  }, []);


  const renderPlayerProps = (game: any) => {
    const playerData: { [key: string]: any } = {};

    // Organize data by player
    game.bookmakers?.forEach((bookmaker: any) => {
      bookmaker.markets.forEach((market: any) => {
        if (market.key === 'player_assists') {
          market.outcomes.forEach((outcome: any) => {
            if (!playerData[outcome.description]) {
              playerData[outcome.description] = {};
            }
            if (!playerData[outcome.description][bookmaker.title]) {
              playerData[outcome.description][bookmaker.title] = {
                over: null,
                under: null,
              };
            }

            // Store the over and under prices
            if (outcome.name === 'Over') {
              playerData[outcome.description][bookmaker.title].over = {
                price: outcome.price,
                points: outcome.point,
              };
            } else if (outcome.name === 'Under') {
              playerData[outcome.description][bookmaker.title].under = {
                price: outcome.price,
                points: outcome.point,
              };
            }
          });
        }
      });
    });

    return Object.keys(playerData).map((playerName) => (
      <div key={playerName} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h4>{playerName}</h4>
        {Object.keys(playerData[playerName]).map((bookmakerName, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{bookmakerName}</strong>
            <ul>
              <li>
                Over: {playerData[playerName][bookmakerName].over?.price} (Assists: {playerData[playerName][bookmakerName].over?.points})
              </li>
              <li>
                Under: {playerData[playerName][bookmakerName].under?.price} (Assists: {playerData[playerName][bookmakerName].under?.points})
              </li>
            </ul>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div>
      <h2>Player Props - Assists</h2>
      {renderPlayerPropsArbitrageBets(playerProps)}
      {playerProps.length === 0 ? (
        <p>Loading...</p>
      ) : (
        playerProps.map((game, index) => (
          <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
            <h3>{game.home_team} vs {game.away_team}</h3>
            {renderPlayerProps(game)}
          </div>
        ))
      )}
    </div>
  );
};

export default PlayerPropsAssists;
