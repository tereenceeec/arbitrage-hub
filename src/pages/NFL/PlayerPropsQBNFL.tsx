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
  Flex,
  Button,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  fetchNFLGameIds,
  fetchNFLPlayerPropsPassYds,
  fetchNFLPlayerPropsPassTds,
} from '../../api';
import axios from 'axios';

// Function to fetch NFL games with team names
const fetchNFLGames = async (): Promise<any[]> => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events', {
      params: {
        regions: 'au',
        apiKey: '6ceee2dfc8c3728dcb0ea0ecdeb77d10', // Using first API key
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching NFL games:', error);
    return [];
  }
};

// Separate component for arbitrage section
const ArbitrageSection = ({ games, marketKey, title }: { games: any, marketKey: string, title: string }) => {
  if (!games) {
    return (
      <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500" paddingBottom='20px'>
        No arbitrage opportunities found for {title}.
      </Box>
    );
  }

  // Handle both array and single object cases
  const gamesArray = Array.isArray(games) ? games : [games];
  
  if (gamesArray.length === 0) {
    return (
      <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">
        No arbitrage opportunities found for {title}.
      </Box>
    );
  }

  const arbitrageCards = renderArbForMarket(gamesArray, marketKey);
  
  return (
    <Box>
      <Heading size="sm" mb={3} color="teal.700">
        Arbitrage Opportunities - {title}
      </Heading>
      {arbitrageCards}
    </Box>
  );
};

// Separate component for arbitrage badge to avoid hook order issues
const ArbitrageBadge = ({ passYdsData, passTdsData }: { passYdsData: any, passTdsData: any }) => {
  const passYdsGames = Array.isArray(passYdsData) ? passYdsData : [passYdsData];
  const passTdsGames = Array.isArray(passTdsData) ? passTdsData : [passTdsData];
  
  const passYdsArb = renderArbForMarket(passYdsGames, 'player_pass_yds');
  const passTdsArb = renderArbForMarket(passTdsGames, 'player_pass_tds');
  
  const totalArbitrage = (passYdsArb?.props?.children?.length || 0) + (passTdsArb?.props?.children?.length || 0);
  
  return totalArbitrage > 0 ? (
    <Badge colorScheme="green" variant="subtle" size="sm">
      {totalArbitrage} Arbitrage
    </Badge>
  ) : (
    <Badge colorScheme="gray" variant="subtle" size="sm">
      0 Arbitrage
    </Badge>
  );
};

// Arbitrage calculation function (moved outside component)
const renderArbForMarket = (games: any[], marketKey: string) => {
  const cards: { jsx: React.ReactNode; profit: number }[] = [];
  const seen = new Set<string>();

  const calcProb = (odds: number) => 1 / odds;
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
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
      {sorted.length > 0 ? sorted.map((c, idx) => <React.Fragment key={idx}>{c.jsx}</React.Fragment>) : (
        <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">No arbitrage found.</Box>
      )}
    </SimpleGrid>
  );
};

interface GameState {
  game: {
    id: string;
    home_team: string;
    away_team: string;
  };
  oddsLoaded: boolean;
  passYdsData: any[];
  passTdsData: any[];
}

const PlayerPropsQBNFL = () => {
  const [games, setGames] = useState<GameState[]>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const nflGames = await fetchNFLGames();
        
        // Initialize games without loading props
        const initialGames: GameState[] = nflGames.map((game: any) => ({
          game: {
            id: game.id,
            home_team: game.home_team,
            away_team: game.away_team
          },
          oddsLoaded: false,
          passYdsData: [],
          passTdsData: []
        }));
        
        setGames(initialGames);
      } catch (e) {
        console.error('Failed to fetch NFL games:', e);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  const selectGame = async (index: number) => {
    setSelectedGameIndex(index);
    const gameState = games[index];
    
    if (!gameState.oddsLoaded) {
      // Load props for this specific game
      try {
        const passYdsData = await fetchNFLPlayerPropsPassYds(gameState.game.id);
        const passTdsData = await fetchNFLPlayerPropsPassTds(gameState.game.id);
        
        setGames(prevGames => {
          const newGames = [...prevGames];
          newGames[index] = {
            ...gameState,
            oddsLoaded: true,
            passYdsData: passYdsData || [],
            passTdsData: passTdsData || []
          };
          return newGames;
        });
      } catch (e) {
        console.error('Failed to fetch props for game:', e);
      }
    }
  };

  // Helper function to render player props table - using original working logic
  const renderPlayerPropsTable = (gameData: any, marketKey: string, title: string) => {
    
    if (!gameData) {
      return (
        <Box p={4} textAlign="center" color="gray.500">
          No {title} data available.
        </Box>
      );
    }

    // Handle both array and single object cases
    const games = Array.isArray(gameData) ? gameData : [gameData];
    
    if (games.length === 0) {
      return (
        <Box p={4} textAlign="center" color="gray.500">
          No {title} data available.
        </Box>
      );
    }

    // Use the same table style as NFL H2H page
    const playerData: { [key: string]: any } = {};

    games.forEach((game: any) => {
      game.bookmakers?.forEach((bookmaker: any) => {
        bookmaker.markets?.forEach((market: any) => {
          if (market.key === marketKey) {
            market.outcomes?.forEach((outcome: any) => {
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
    });

    return (
      <Box>
        <Heading size="sm" mb={3} color="teal.700">
          {title}
        </Heading>
        <TableContainer>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Player</Th>
                <Th textAlign="center">Bookmaker</Th>
                <Th textAlign="center">Over</Th>
                <Th textAlign="center">Under</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(playerData).map((playerName) => 
                Object.keys(playerData[playerName]).map((bookmakerName, index) => (
                  <Tr key={`${playerName}-${bookmakerName}-${index}`}>
                    <Td fontWeight="semibold" color="blue.600">
                      {playerName}
                    </Td>
                    <Td textAlign="center" fontWeight="bold" color="teal.600">
                      {bookmakerName}
                    </Td>
                    <Td textAlign="center">
                      {playerData[playerName][bookmakerName].over ? (
                        <VStack spacing={1}>
                          <Badge colorScheme="blue" variant="outline">
                            {playerData[playerName][bookmakerName].over.points}
                          </Badge>
                          <Badge colorScheme="green" variant="outline">
                            {playerData[playerName][bookmakerName].over.price}
                          </Badge>
                        </VStack>
                      ) : '-'}
                    </Td>
                    <Td textAlign="center">
                      {playerData[playerName][bookmakerName].under ? (
                        <VStack spacing={1}>
                          <Badge colorScheme="blue" variant="outline">
                            {playerData[playerName][bookmakerName].under.points}
                          </Badge>
                          <Badge colorScheme="green" variant="outline">
                            {playerData[playerName][bookmakerName].under.price}
                          </Badge>
                        </VStack>
                      ) : '-'}
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  };


  if (loading) {
    return (
      <Box w="100%" p={4} textAlign="center">
        <Spinner size="xl" color="teal.500" />
        <Text mt={4}>Loading NFL games...</Text>
      </Box>
    );
  }

  const selectedGame = selectedGameIndex !== null ? games[selectedGameIndex] : null;

  return (
    <Box w="100%" p={4}>
      <Heading as="h1" size="lg" mb={6} color="teal.800">
        NFL Player Props - QB
      </Heading>
      
      <Flex gap={6} h="calc(100vh - 200px)">
        {/* Left Side - Games List */}
        <Box w="400px" borderWidth="1px" borderColor={borderColor} borderRadius="md" overflow="hidden">
          <Box bg="teal.500" color="white" p={3}>
            <Heading size="sm">Games</Heading>
          </Box>
          <Box maxH="100%" overflowY="auto">
            {games.map((gameState, index) => (
              <Button
                key={`game-${index}`}
                w="100%"
                variant="ghost"
                justifyContent="flex-start"
                p={4}
                h="auto"
                onClick={() => selectGame(index)}
                bg={selectedGameIndex === index ? "teal.50" : "transparent"}
                _hover={{ bg: hoverBg }}
                borderBottom="1px"
                borderColor={borderColor}
                borderRadius="0"
              >
                <VStack align="start" spacing={1} w="100%">
                  <Text fontWeight="bold" fontSize="sm" textAlign="left">
                    {gameState.game.home_team} vs {gameState.game.away_team}
                  </Text>
                  {gameState.oddsLoaded && (
                    <HStack spacing={2}>
                      <Badge colorScheme="blue" variant="subtle" size="sm">
                        Props Loaded
                      </Badge>
                      <ArbitrageBadge 
                        passYdsData={gameState.passYdsData} 
                        passTdsData={gameState.passTdsData} 
                      />
                    </HStack>
                  )}
                </VStack>
              </Button>
            ))}
          </Box>
        </Box>

        {/* Right Side - Game Details */}
        <Box flex={1} borderWidth="1px" borderColor={borderColor} borderRadius="md" overflow="hidden">
          {selectedGame ? (
            <>
              <Box bg="teal.500" color="white" p={3}>
                <Heading size="sm">
                  {selectedGame.game.home_team} vs {selectedGame.game.away_team} - QB Player Props
                </Heading>
              </Box>
              <Box p={4} maxH="100%" overflowY="auto">
                {!selectedGame.oddsLoaded ? (
                  <Flex justify="center" align="center" py={8}>
                    <Spinner size="md" color="teal.500" />
                    <Text ml={3}>Loading player props...</Text>
                  </Flex>
                ) : (
                  <VStack spacing={6} align="stretch">
                    {/* Arbitrage Sections */}
                    <ArbitrageSection 
                      games={selectedGame.passYdsData} 
                      marketKey="player_pass_yds" 
                      title="Passing Yards" 
                    />
                    
                    <ArbitrageSection 
                      games={selectedGame.passTdsData} 
                      marketKey="player_pass_tds" 
                      title="Passing TDs" 
                    />

                    <Divider borderColor="teal.300" />

                    {/* Player Props Tables */}
                    <VStack spacing={6} align="stretch">
                      {renderPlayerPropsTable(selectedGame.passYdsData, 'player_pass_yds', 'Passing Yards')}
                      {renderPlayerPropsTable(selectedGame.passTdsData, 'player_pass_tds', 'Passing TDs')}
                    </VStack>
                  </VStack>
                )}
              </Box>
            </>
          ) : (
            <Flex justify="center" align="center" h="100%" color="gray.500">
              <VStack spacing={4}>
                <Text fontSize="lg">Select a game to view player props</Text>
                <Text fontSize="sm">Click on any game from the list to see QB player props and arbitrage opportunities</Text>
              </VStack>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default PlayerPropsQBNFL;
