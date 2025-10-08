import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  Text, 
  Button, 
  Spinner, 
  SimpleGrid,
  Badge,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue
} from '@chakra-ui/react';
import { fetchNBASpreadOdds, fetchGameIds, fetchAlternateSpreads } from '../../api';
import { renderArbitrageBets, Game } from '../../components/functions/renderArbitrageBets';

// Separate component for arbitrage section to avoid hook order issues
const ArbitrageSection = ({ spreadOdds }: { spreadOdds: Game[] }) => {
  const arbitrage = renderArbitrageBets(spreadOdds, 'spreads');
  
  if (arbitrage.length === 0) {
    return (
      <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">
        No arbitrage opportunities found for this game.
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="sm" mb={3} color="teal.700">
        Arbitrage Opportunities ({arbitrage.length})
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        {arbitrage.map((arb, arbIndex) => (
          <Box key={arbIndex} transform="scale(0.9)" transformOrigin="top left">
            {arb}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

// Separate component for arbitrage badge to avoid hook order issues
const ArbitrageBadge = ({ spreadOdds }: { spreadOdds: Game[] }) => {
  const arbitrage = renderArbitrageBets(spreadOdds, 'spreads');
  
  return arbitrage.length > 0 ? (
    <Badge colorScheme="green" variant="subtle" size="sm">
      {arbitrage.length} Arbitrage
    </Badge>
  ) : (
    <Badge colorScheme="gray" variant="subtle" size="sm">
      0 Arbitrage
    </Badge>
  );
};

interface GameState {
  game: Game;
  oddsLoaded: boolean;
  spreadOdds: Game[];
}

const SpreadsNBA = () => {
  const [games, setGames] = useState<GameState[]>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const data = await fetchNBASpreadOdds();
        
        // Initialize games without loading odds
        const initialGames: GameState[] = data.map((game: Game) => ({
          game,
          oddsLoaded: false,
          spreadOdds: []
        }));
        
        setGames(initialGames);
      } catch (e) {
        console.error('Failed to fetch NBA games:', e);
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
      // Load odds for this specific game
      try {
        const spreadData = await fetchNBASpreadOdds();
        const eventIds = await fetchGameIds();
        const altSpreads = await fetchAlternateSpreads(eventIds);
        const allSpreads = [...spreadData, ...altSpreads];
        
        const gameOdds = allSpreads.filter((g: Game) => 
          g.home_team === gameState.game.home_team && 
          g.away_team === gameState.game.away_team
        );
        
        setGames(prevGames => {
          const newGames = [...prevGames];
          newGames[index] = {
            ...gameState,
            oddsLoaded: true,
            spreadOdds: gameOdds
          };
          return newGames;
        });
      } catch (e) {
        console.error('Failed to fetch odds for game:', e);
      }
    }
  };

  if (loading) {
    return (
      <Box w="100%" p={4} textAlign="center">
        <Spinner size="xl" color="teal.500" />
        <Text mt={4}>Loading NBA games...</Text>
      </Box>
    );
  }

  const selectedGame = selectedGameIndex !== null ? games[selectedGameIndex] : null;

  return (
    <Box w="100%" p={4}>
      <Heading as="h1" size="lg" mb={6} color="teal.800">
        NBA Spreads
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
                key={`${gameState.game.home_team}-${gameState.game.away_team}`}
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
                        Odds Loaded
                      </Badge>
                      <ArbitrageBadge spreadOdds={gameState.spreadOdds} />
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
                  {selectedGame.game.home_team} vs {selectedGame.game.away_team}
                </Heading>
              </Box>
              <Box p={4} maxH="100%" overflowY="auto">
                {!selectedGame.oddsLoaded ? (
                  <Flex justify="center" align="center" py={8}>
                    <Spinner size="md" color="teal.500" />
                    <Text ml={3}>Loading odds...</Text>
                  </Flex>
                ) : (
                  <VStack spacing={6} align="stretch">
                    {/* Arbitrage Section */}
                    <ArbitrageSection spreadOdds={selectedGame.spreadOdds} />

                    {/* Spread Odds Table */}
                    <Box>
                      <Heading size="sm" mb={3} color="teal.700">
                        Spread Odds
                      </Heading>
                      <TableContainer>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Bookmaker</Th>
                              <Th textAlign="center">Home Spread</Th>
                              <Th textAlign="center">Away Spread</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {selectedGame.spreadOdds.map(game => 
                              game.bookmakers.map(bookmaker => {
                                const market = bookmaker.markets?.find(m => m.key === 'spreads');
                                if (!market) return null;
                                
                                const homeOutcome = market.outcomes.find(o => o.name === 'Home' || o.name === game.home_team);
                                const awayOutcome = market.outcomes.find(o => o.name === 'Away' || o.name === game.away_team);
                                
                                return (
                                  <Tr key={bookmaker.key}>
                                    <Td fontWeight="semibold" color="blue.600">
                                      {bookmaker.title}
                                    </Td>
                                    <Td >
                                      {homeOutcome ? (
                                        <VStack spacing={1}>
                                          <Badge colorScheme="blue" variant="outline">
                                            {homeOutcome.point}
                                          </Badge>
                                          <Badge colorScheme="green" variant="outline">
                                            {homeOutcome.price}
                                          </Badge>
                                        </VStack>
                                      ) : '-'}
                                    </Td>
                                    <Td >
                                      {awayOutcome ? (
                                        <VStack spacing={1}>
                                          <Badge colorScheme="blue" variant="outline">
                                            {awayOutcome.point}
                                          </Badge>
                                          <Badge colorScheme="green" variant="outline">
                                            {awayOutcome.price}
                                          </Badge>
                                        </VStack>
                                      ) : '-'}
                                    </Td>
                                  </Tr>
                                );
                              })
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </VStack>
                )}
              </Box>
            </>
          ) : (
            <Flex justify="center" align="center" h="100%" color="gray.500">
              <VStack spacing={4}>
                <Text fontSize="lg">Select a game to view details</Text>
                <Text fontSize="sm">Click on any game from the list to see arbitrage opportunities and odds</Text>
              </VStack>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SpreadsNBA;
