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

const isValidSpreadArb = (p1: string | number, p2: string | number): boolean => {
  const num1 = Number(p1);
  const num2 = Number(p2);
  return num1 === -num2;
};

const isValidTotalArb = (p1: string | number, p2: string | number): boolean => {
  const num1 = Number(p1);
  const num2 = Number(p2);

  if (isNaN(num1) || isNaN(num2)) return false;

  // For totals, Over and Under can be valid as long as their points are close or within reasonable bounds
  return num1 <= num2;
};

export const renderArbitrageBets = (games: Game[], marketKey: string): JSX.Element[] => {
  const bets: JSX.Element[] = [];

  games.forEach(game => {
    game.bookmakers.forEach(b1 => {
      game.bookmakers.forEach(b2 => {
        if (b1.key !== b2.key) {
          const m1 = extractMarket(b1.markets, marketKey);
          const m2 = extractMarket(b2.markets, marketKey);
          if (m1 && m2) {
            const o1 = m1.outcomes.find(o => o.name === 'Over' || o.name === game.home_team); // H2H or Over
            const o2 = m2.outcomes.find(o => o.name === 'Under' || o.name === game.away_team); // Under or Away Team

            if (o1 && o2 && checkArbitrage(o1.price, o2.price)) {
              const p1 = o1.point;
              const p2 = o2.point;

              const point1 = Number(p1);
              const point2 = Number(p2);

              const isValid =
                (p1 !== undefined && p2 !== undefined &&
                  (
                    // For totals with o1.point <= o2.point (allowing over and under to match)
                    (o1.name === 'Over' && o2.name === 'Under' && point1 <= point2) ||
                    // For spreads with o1.point < 100 (ensure point1 == -point2)
                    (point1 < 100 && isValidSpreadArb(point1, point2)) ||
                    // For H2H, no points comparison needed
                    (o1.name !== 'Over' && o2.name !== 'Under' && o1.point === undefined && o2.point === undefined)
                  )
                ) ||
                (p1 === undefined && p2 === undefined); // Handle H2H arbitrage (no points)

              if (isValid) {
                bets.push(
                  <div
                    key={`${game.home_team}-${game.away_team}-${b1.key}-${b2.key}-${marketKey}-${p1}-${p2}`}
                    style={{
                      border: '1px solid #ccc',
                      padding: '1rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      marginBottom: '1rem',
                    }}
                  >
                    <strong>{game.home_team} vs {game.away_team}</strong><br />
                    {b1.title} (Home): {o1.name} @ {o1.price}
                    {p1 !== undefined ? ` (Points: ${p1})` : ''}<br />
                    {b2.title} (Away): {o2.name} @ {o2.price}
                    {p2 !== undefined ? ` (Points: ${p2})` : ''}<br />
                    <strong style={{ color: 'red' }}>Arbitrage!</strong>
                  </div>
                );
              }
            }
          }
        }
      });
    });
  });

  return bets;
};
