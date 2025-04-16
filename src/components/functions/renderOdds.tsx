import React, { JSX } from 'react';

export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  markets: Market[];
}

export interface Game {
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

const extractMarket = (markets: Market[], key: string) =>
  markets.find(m => m.key === key);

export const renderOdds = (games: Game[], marketKey: string): JSX.Element[] => {
  return games.map(game => (
    <div key={`${game.home_team}-${game.away_team}-${marketKey}`}
         style={{
           border: '1px solid #ccc',  // Box border
           padding: '1rem',           // Padding inside the box
           marginBottom: '1.5em',     // Space between matches
           borderRadius: '8px',       // Rounded corners for the box
           backgroundColor: '#f9f9f9' // Light background color
         }}>
      <h3 style={{ marginBottom: '1rem' }}>{game.home_team} vs {game.away_team}</h3>
      <ul style={{ paddingLeft: '20px', listStyle: 'none', margin: 0 }}>
        {game.bookmakers.map(b => {
          const market = extractMarket(b.markets, marketKey);
          if (!market) return null;
          return (
            <li key={`${b.key}-${marketKey}`} style={{ marginBottom: '1em' }}>
              <strong>{b.title}</strong>
              <ul>
                {market.outcomes.map(outcome => (
                  <li key={outcome.name}>
                    {outcome.name}: {outcome.price}
                    {outcome.point !== undefined ? ` (Points: ${outcome.point})` : ''}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  ));
};
