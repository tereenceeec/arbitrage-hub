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
         style={{ borderBottom: '1px solid #ccc', marginBottom: '1em', paddingBottom: '1em' }}>
      <strong>{game.home_team} vs {game.away_team}</strong>
      <ul>
        {game.bookmakers.map(b => {
          const market = extractMarket(b.markets, marketKey);
          if (!market) return null;
          return (
            <li key={`${b.key}-${marketKey}`}>
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
