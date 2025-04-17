import React, { JSX } from 'react';
import { Box, Text, UnorderedList, ListItem } from '@chakra-ui/react';

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
    <Box
      key={`${game.home_team}-${game.away_team}-${marketKey}`}
      borderWidth="1px"
      borderRadius="md"
      p={4}
      mb={6}
      bg="gray.50"
      boxShadow="md"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} color="teal.500">
        {game.home_team} vs {game.away_team}
      </Text>
      <UnorderedList pl={5} styleType="none" m={0}>
        {game.bookmakers.map(b => {
          const market = extractMarket(b.markets, marketKey);
          if (!market) return null;
          return (
            <ListItem key={`${b.key}-${marketKey}`} mb={4}>
              <Text fontWeight="semibold" color="blue.600">{b.title}</Text>
              <UnorderedList listStyleType="unset">
                {market.outcomes.map(outcome => (
                  <ListItem key={outcome.name}>
                    <Text color="gray.700">
                      <strong>{outcome.name}: </strong>{outcome.price}
                      {outcome.point !== undefined ? ` (Points: ${outcome.point})` : ''}
                    </Text>
                  </ListItem>
                ))}
              </UnorderedList>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  ));
};
