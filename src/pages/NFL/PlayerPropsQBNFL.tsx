import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Spinner,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import {
  fetchNFLGameIds,
  fetchNFLPlayerPropsPassYds,
  fetchNFLPlayerPropsPassTds,
} from '../../api';

const PlayerPropsQBNFL = () => {
  const [passYds, setPassYds] = useState<any[]>([]);
  const [passTds, setPassTds] = useState<any[]>([]);

  useEffect(() => {
    const loadProps = async () => {
      try {
        const ids = await fetchNFLGameIds();

        const combinedPassYds = await Promise.all(
          ids.map(async (id) => {
            const mainProps = await fetchNFLPlayerPropsPassYds(id);
            return mainProps;
          })
        );

        const combinedPassTds = await Promise.all(
          ids.map(async (id) => {
            const mainProps = await fetchNFLPlayerPropsPassTds(id);
            return mainProps;
          })
        );

        setPassYds(combinedPassYds);
        setPassTds(combinedPassTds);
      } catch (error) {
        console.error('Failed to fetch NFL QB props:', error);
      }
    };

    loadProps();
  }, []);

  const renderPropsList = (game: any, marketKey: string, label: string) => {
    const playerData: { [key: string]: any } = {};

    game.bookmakers?.forEach((bookmaker: any) => {
      bookmaker.markets.forEach((market: any) => {
        if (market.key === marketKey) {
          market.outcomes.forEach((outcome: any) => {
            if (!playerData[outcome.description]) playerData[outcome.description] = {};
            if (!playerData[outcome.description][bookmaker.title]) {
              playerData[outcome.description][bookmaker.title] = { over: null, under: null };
            }
            if (outcome.name === 'Over') {
              playerData[outcome.description][bookmaker.title].over = { price: outcome.price, points: outcome.point };
            } else if (outcome.name === 'Under') {
              playerData[outcome.description][bookmaker.title].under = { price: outcome.price, points: outcome.point };
            }
          });
        }
      });
    });

    return Object.keys(playerData).map((playerName) => (
      <Box key={playerName} mb={4} p={4} bg="gray.50">
        <Heading size="lg" mb={2} fontWeight="bold" color="teal.500">{playerName}</Heading>
        {Object.keys(playerData[playerName]).map((bookmakerName, index) => (
          <Box key={index} mb={4}>
            <Text fontWeight="bold" fontSize="lg" color="blue.600">{bookmakerName}</Text>
            <Box pl={5}>
              <Text mb={2} fontSize="sm"><strong>Over:</strong> {playerData[playerName][bookmakerName].over?.price} ({label}: {playerData[playerName][bookmakerName].over?.points})</Text>
              <Text fontSize="sm"><strong>Under:</strong> {playerData[playerName][bookmakerName].under?.price} ({label}: {playerData[playerName][bookmakerName].under?.points})</Text>
            </Box>
          </Box>
        ))}
      </Box>
    ));
  };

  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const renderArbForMarket = (games: any[], marketKey: string) => {
    const cards: { jsx: React.ReactNode; profit: number }[] = [];
    const seen = new Set<string>();

    const calcProb = (odds: number) => 2 / odds;
    const isArb = (over: number, under: number) => calcProb(over) + calcProb(under) < 1;

    games.forEach((game) => {
      const players: Record<string, Record<string, { overs: any[]; unders: any[] }>> = {};
      game.bookmakers?.forEach((bookmaker: any) => {
        const market = bookmaker.markets?.find((m: any) => m.key === marketKey);
        const outcomes = market?.outcomes || [];
        outcomes.forEach((outcome: any) => {
          const playerName = outcome.description;
          if (!players[playerName]) players[playerName] = {};
          if (!players[playerName][bookmaker.title]) players[playerName][bookmaker.title] = { overs: [], unders: [] };
          if (outcome.name === 'Over') players[playerName][bookmaker.title].overs.push(outcome);
          if (outcome.name === 'Under') players[playerName][bookmaker.title].unders.push(outcome);
        });
      });

      Object.entries(players).forEach(([playerName, books]) => {
        const bookEntries = Object.entries(books);
        for (let i = 0; i < bookEntries.length; i++) {
          const [bk1, odds1] = bookEntries[i];
          for (let j = 0; j < bookEntries.length; j++) {
            if (i === j) continue;
            const [bk2, odds2] = bookEntries[j];
            odds1.overs.forEach((over) => {
              odds2.unders.forEach((under) => {
                if (over.point !== undefined && under.point !== undefined && over.point <= under.point && isArb(over.price, under.price)) {
                  const profit = ((1 / ((1 / over.price) + (1 / under.price))) - 1) * 100;
                  const key = `${game.home_team}-${game.away_team}-${playerName}-${over.point}-${under.point}-${marketKey}`;
                  if (seen.has(key)) return;
                  seen.add(key);
                  cards.push({
                    profit,
                    jsx: (
                      <Box key={key} borderWidth="1px" borderRadius="md" p={4} bg="gray.50" boxShadow="md">
                        <Text fontWeight="bold" fontSize="lg" color="teal.500">{game.home_team} vs {game.away_team}</Text>
                        <Text fontWeight="bold" fontSize="lg" color="blue.600">{playerName}</Text>
                        <Text fontSize="sm"><strong>{bk1} (Over): </strong> {over.price} (Line: {over.point})</Text>
                        <Text fontSize="sm"><strong>{bk2} (Under): </strong> {under.price} (Line: {under.point})</Text>
                        <Text fontWeight="bold" color="red.500">Profit: {profit.toFixed(2)}%</Text>
                      </Box>
                    ),
                  });
                }
              });
            });
          }
        }
      });
    });

    const sorted = cards.sort((a, b) => b.profit - a.profit);
    return (
      <Grid templateColumns={{ base: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' }} gap={4} py={4}>
        {sorted.length > 0 ? sorted.map((c, idx) => <React.Fragment key={idx}>{c.jsx}</React.Fragment>) : (
          <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">No arbitrage found.</Box>
        )}
      </Grid>
    );
  };

  return (
    <Box p={4}>
      <Heading mb={4}>NFL Player Props - QB</Heading>

      {/* Arbitrage Sections */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={8}>
        <Box>
          <Heading size="md" mb={2}>Arbitrage - Passing Yards</Heading>
          {renderArbForMarket(passYds, 'player_pass_yds')}
        </Box>
        <Box>
          <Heading size="md" mb={2}>Arbitrage - Passing TDs</Heading>
          {renderArbForMarket(passTds, 'player_pass_tds')}
        </Box>
      </Grid>

      <Divider borderColor="teal.300" my={6} />

      {/* Detailed Lists */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        <Box>
          <Heading size="md" mb={4}>Passing Yards</Heading>
          {passYds.length === 0 ? (
            <Spinner size="xl" thickness="4px" color="teal.500" />
          ) : (
            passYds.map((game, index) => (
              <Box key={index} mb={10}>
                <Heading size="sm" mb={3}>{game.home_team} vs {game.away_team}</Heading>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  {renderPropsList(game, 'player_pass_yds', 'Yards').map((prop, idx) => (
                    <GridItem key={idx} p={4} borderWidth="1px" borderRadius="md" bg={bgColor} boxShadow="sm">{prop}</GridItem>
                  ))}
                </Grid>
              </Box>
            ))
          )}
        </Box>

        <Box>
          <Heading size="md" mb={4}>Passing TDs</Heading>
          {passTds.length === 0 ? (
            <Spinner size="xl" thickness="4px" color="teal.500" />
          ) : (
            passTds.map((game, index) => (
              <Box key={index} mb={10}>
                <Heading size="sm" mb={3}>{game.home_team} vs {game.away_team}</Heading>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  {renderPropsList(game, 'player_pass_tds', 'TDs').map((prop, idx) => (
                    <GridItem key={idx} p={4} borderWidth="1px" borderRadius="md" bg={bgColor} boxShadow="sm">{prop}</GridItem>
                  ))}
                </Grid>
              </Box>
            ))
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default PlayerPropsQBNFL;


