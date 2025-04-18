import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { fetchGameIds, fetchPlayerPropsRebounds, fetchPlayerPropsAlternateRebounds } from '../api';
import { renderArbitrageRebounds } from '../components/functions/renderArbitrageRebounds';

const PlayerPropsRebounds = () => {
  const [playerProps, setPlayerProps] = useState<any[]>([]);

  useEffect(() => {
    const loadPlayerProps = async () => {
      try {
        const ids = await fetchGameIds();

        const combinedGames = await Promise.all(
          ids.map(async (id) => {
            const [mainProps, altProps] = await Promise.all([
              fetchPlayerPropsRebounds(id),
              fetchPlayerPropsAlternateRebounds(id),
            ]);

            // Merge markets (assumes same structure, same bookmakers array)
            const mergedBookmakers = mainProps.bookmakers.map((bookmaker: any) => {
              const altBookmaker = altProps.bookmakers.find((b: any) => b.key === bookmaker.key);
              const mergedMarkets = [
                ...(bookmaker.markets || []),
                ...(altBookmaker?.markets || []),
              ];
              return {
                ...bookmaker,
                markets: mergedMarkets,
              };
            });

            return {
              ...mainProps,
              bookmakers: mergedBookmakers,
            };
          })
        );

        setPlayerProps(combinedGames);
      } catch (error) {
        console.error('Failed to fetch player props:', error);
      }
    };

    loadPlayerProps();
  }, []);

  const renderPlayerProps = (game: any) => {
    const playerData: { [key: string]: any } = {};

    game.bookmakers?.forEach((bookmaker: any) => {
      bookmaker.markets.forEach((market: any) => {
        if (market.key === 'player_rebounds') {
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
      <Box key={playerName} mb={4} p={4} bg="gray.50">
        <Heading size="lg" mb={2} fontWeight="bold" color="teal.500">
          {playerName}
        </Heading>
        {Object.keys(playerData[playerName]).map((bookmakerName, index) => (
          <Box key={index} mb={4}>
            <Text fontWeight="bold" fontSize="lg" color="blue.600">
              {bookmakerName}
            </Text>
            <Box pl={5}>
              <Text mb={2} fontSize="sm">
                <strong>Over:</strong> {playerData[playerName][bookmakerName].over?.price} (Rebounds: {playerData[playerName][bookmakerName].over?.points})
              </Text>
              <Text fontSize="sm">
                <strong>Under:</strong> {playerData[playerName][bookmakerName].under?.price} (Rebounds: {playerData[playerName][bookmakerName].under?.points})
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    ));
  };

  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box p={4}>
      <Heading mb={4}>Player Props - Rebounds</Heading>

      <Heading size="md" mb={2}>
        Arbitrage
      </Heading>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(1, 1fr)' }} gap={4} mb={6}>
        {renderArbitrageRebounds(playerProps) ? (
          renderArbitrageRebounds(playerProps)
        ) : (
          <Text>No arbitrage opportunities found.</Text>
        )}
      </Grid>

      {playerProps.length === 0 ? (
        <Spinner size="xl" thickness="4px" color="teal.500" />
      ) : (
        playerProps.map((game, index) => (
          <Box key={index} mb={10}>
            <Heading size="md" mb={4}>
              {game.home_team} vs {game.away_team}
            </Heading>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
              {renderPlayerProps(game).map((prop, idx) => (
                <GridItem
                  key={idx}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg={bgColor}
                  boxShadow="sm"
                >
                  {prop}
                </GridItem>
              ))}
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
};

export default PlayerPropsRebounds;
