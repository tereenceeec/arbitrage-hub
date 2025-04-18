import React, { JSX } from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';

interface Outcome {
  name: string;
  price: number;
  point?: number;
  description: string; // Player name
}

interface Market {
  key: string;
  outcomes: Outcome[];
}

interface Bookmaker {
  key: string;
  title: string;
  markets?: Market[];
}

interface Game {
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

const calculateImpliedProbability = (odds: number) => 1 / odds;

const checkArbitrage = (overOdds: number, underOdds: number) => {
  const probOver = calculateImpliedProbability(overOdds);
  const probUnder = calculateImpliedProbability(underOdds);
  return probOver + probUnder < 1;
};

const extractPlayerAssists = (markets?: Market[]) =>
  markets?.find((m) => m.key === 'player_assists');

export const renderArbitrageAssists = (games: Game[]): JSX.Element => {
  const playerPropsArbitrage: JSX.Element[] = [];

  games.forEach((game) => {
    const players: Record<string, Record<string, { over?: Outcome; under?: Outcome }>> = {};

    game.bookmakers.forEach((bookmaker) => {
      const assistMarket = extractPlayerAssists(bookmaker.markets);
      if (!assistMarket) return;

      assistMarket.outcomes.forEach((outcome) => {
        const playerName = outcome.description;
        if (!players[playerName]) players[playerName] = {};
        if (!players[playerName][bookmaker.title]) players[playerName][bookmaker.title] = {};

        if (outcome.name === 'Over') {
          players[playerName][bookmaker.title].over = outcome;
        } else if (outcome.name === 'Under') {
          players[playerName][bookmaker.title].under = outcome;
        }
      });
    });

    Object.entries(players).forEach(([playerName, books]) => {
      const bookmakers = Object.entries(books);
      for (let i = 0; i < bookmakers.length; i++) {
        const [bk1, odds1] = bookmakers[i];
        for (let j = 0; j < bookmakers.length; j++) {
          if (i === j) continue;
          const [bk2, odds2] = bookmakers[j];

          if (
            odds1.over &&
            odds2.under &&
            odds1.over.point !== undefined &&
            odds2.under.point !== undefined &&
            odds1.over.point <= odds2.under.point &&
            checkArbitrage(odds1.over.price, odds2.under.price)
          ) {
            playerPropsArbitrage.push(
              <Box
                key={`${game.home_team}-${game.away_team}-${playerName}-${bk1}-${bk2}-${odds1.over.point}-${odds2.under.point}`}
                borderWidth="1px"
                borderRadius="md"
                p={4}
                boxShadow="md"
                bg="gray.50"
              >
                <Text fontWeight="bold" fontSize="lg" color="teal.500">
                  {game.home_team} vs {game.away_team}
                </Text>
                <Text fontWeight="bold" fontSize="lg" color="blue.600">
                  {playerName} (Assists Market)
                </Text>
                <Text fontSize="sm">
                  <strong>{bk1} (Over):</strong> {odds1.over.price} (Line: {odds1.over.point})
                </Text>
                <Text fontSize="sm">
                  <strong>{bk2} (Under):</strong> {odds2.under.price} (Line: {odds2.under.point})
                </Text>
                <Text fontWeight="bold" color="red.500">
                  Arbitrage!
                </Text>
              </Box>
            );
          }
        }
      }
    });
  });

  return (
    <Grid templateColumns={{ base: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }} gap={5} py={5}>
      {playerPropsArbitrage.length > 0 ? (
        playerPropsArbitrage
      ) : (
        <Box
          p={4}
          textAlign="center"
          border="1px dashed"
          borderColor="gray.300"
          borderRadius="md"
          color="gray.500"
        >
          No arbitrage found.
        </Box>
      )}
    </Grid>
  );
};
