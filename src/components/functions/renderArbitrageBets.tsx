// src/renderArbitrageBets.tsx

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

const calculateImpliedProbability = (odds: number) => 1 / odds;

const checkArbitrage = (homeOdds: number, awayOdds: number) => {
  const homeProb = calculateImpliedProbability(homeOdds);
  const awayProb = calculateImpliedProbability(awayOdds);
  return homeProb + awayProb < 1;
};

const extractMarket = (markets: Market[], key: string) =>
  markets.find(m => m.key === key);

export const renderArbitrageBets = (games: Game[], marketKey: string): JSX.Element[] => {
  const bets: JSX.Element[] = [];

  games.forEach(game => {
    game.bookmakers.forEach(b1 => {
      game.bookmakers.forEach(b2 => {
        if (b1.key !== b2.key) {
          const m1 = extractMarket(b1.markets, marketKey);
          const m2 = extractMarket(b2.markets, marketKey);
          if (m1 && m2) {
            const o1 = m1.outcomes.find(o => o.name === game.home_team);
            const o2 = m2.outcomes.find(o => o.name === game.away_team);
            if (o1 && o2 && checkArbitrage(o1.price, o2.price)) {
              bets.push(
                <li key={`${game.home_team}-${game.away_team}-${b1.key}-${b2.key}-${marketKey}`}>
                  <strong>{game.home_team} vs {game.away_team}</strong>
                  <br />
                  {b1.title} (Home): {o1.name} @ {o1.price}
                  {o1.point !== undefined ? ` (Points: ${o1.point})` : ''}
                  <br />
                  {b2.title} (Away): {o2.name} @ {o2.price}
                  {o2.point !== undefined ? ` (Points: ${o2.point})` : ''}
                  <br />
                  <strong style={{ color: 'red' }}>Arbitrage!</strong>
                </li>
              );
            }
          }
        }
      });
    });
  });

  return bets;
};
