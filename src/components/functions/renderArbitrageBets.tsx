import React, { JSX } from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';

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
            const o1 = m1.outcomes.find(o => o.name === 'Over' || o.name === game.home_team);
            const o2 = m2.outcomes.find(o => o.name === 'Under' || o.name === game.away_team);

            if (o1 && o2 && checkArbitrage(o1.price, o2.price)) {
              const p1 = o1.point;
              const p2 = o2.point;

              const point1 = Number(p1);
              const point2 = Number(p2);

              const isValid =
                (p1 !== undefined && p2 !== undefined &&
                  (
                    (o1.name === 'Over' && o2.name === 'Under' && point1 <= point2) ||
                    (point1 < 100 && isValidSpreadArb(point1, point2)) ||
                    (o1.name !== 'Over' && o2.name !== 'Under' && o1.point === undefined && o2.point === undefined)
                  )
                ) ||
                (p1 === undefined && p2 === undefined);

              if (isValid) {
                bets.push(
                  <Box
                    key={`${game.home_team}-${game.away_team}-${b1.key}-${b2.key}-${marketKey}-${p1}-${p2}`}
                    borderWidth="1px"
                    borderRadius="md"
                    p={4}
                    boxShadow="md"
                    bg="gray.50"
                    mb={4}
                  >
                    <Text fontWeight="bold" fontSize="lg" color="teal.500">
                      {game.home_team} vs {game.away_team}
                    </Text>
                    <Text fontWeight="bold" fontSize="md" color="blue.600">
                      {b1.title} (Home): {o1.name} @ {o1.price}
                      {p1 !== undefined ? ` (Points: ${p1})` : ''}
                    </Text>
                    <Text fontWeight="bold" fontSize="md" color="blue.600">
                      {b2.title} (Away): {o2.name} @ {o2.price}
                      {p2 !== undefined ? ` (Points: ${p2})` : ''}
                    </Text>
                    <Text fontWeight="bold" color="red.500">
                      Arbitrage!
                    </Text>
                  </Box>
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
