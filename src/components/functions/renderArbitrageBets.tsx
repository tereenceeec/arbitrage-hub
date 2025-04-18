import React, { JSX } from 'react';
import { Box, Text } from '@chakra-ui/react';

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

const checkArbitrage = (price1: number, price2: number) =>
  calculateImpliedProbability(price1) + calculateImpliedProbability(price2) < 1;

const combineMarkets = (bookmakerKey: string, games: Game[], marketKeys: string[]): Market[] => {
  const combinedMarkets: Market[] = [];

  games.forEach(game => {
    game.bookmakers.forEach(b => {
      if (b.key === bookmakerKey) {
        b.markets.forEach(market => {
          if (marketKeys.includes(market.key)) {
            // Combine the markets if it's a spread or total market
            if (['spreads', 'alternate_spreads', 'totals', 'alternate_totals'].includes(market.key)) {
              const existingMarket = combinedMarkets.find(m => m.key === market.key);
              if (existingMarket) {
                existingMarket.outcomes = [...existingMarket.outcomes, ...market.outcomes];
              } else {
                combinedMarkets.push(market);
              }
            }
          }
        });
      }
    });
  });


  return combinedMarkets;
};

const extractMarket = (markets: Market[], marketKey: string): Market | undefined => {
  return markets.find(m => m.key === marketKey);
};

const renderH2HArbitrage = (games: Game[]): JSX.Element[] => {
  const allBets: JSX.Element[] = [];
  
  games.forEach(game => {
    game.bookmakers.forEach(b1 => {
      game.bookmakers.forEach(b2 => {
        if (b1.key !== b2.key) {
          const m1 = extractMarket(b1.markets, 'h2h');
          const m2 = extractMarket(b2.markets, 'h2h');
          if (m1 && m2) {
            const o1 = m1.outcomes.find(o => o.name === 'Home' || o.name === game.home_team);
            const o2 = m2.outcomes.find(o => o.name === 'Away' || o.name === game.away_team);

            if (o1 && o2 && checkArbitrage(o1.price, o2.price)) {
              allBets.push(
                <Box
                  key={`${game.home_team}-${game.away_team}-${b1.key}-${b2.key}-${o1.name}-${o2.name}`}
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
                    {b1.title}: {o1.name} @ {o1.price}
                  </Text>
                  <Text fontWeight="bold" fontSize="md" color="blue.600">
                    {b2.title}: {o2.name} @ {o2.price}
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
  });

  return allBets;
};

const renderSpreadArbitrage = (games: Game[], altGames: Game[]): JSX.Element[] => {
  const allBets: JSX.Element[] = [];

  games.forEach(game => {
    const altGame = altGames.find(g => g.home_team === game.home_team && g.away_team === game.away_team);

    game.bookmakers.forEach(b1 => {
      game.bookmakers.forEach(b2 => {
        if (b1.key !== b2.key) {
          // Combine both "spreads" and "alternate_spreads" markets for both bookmakers
          const m1Combined = combineMarkets(b1.key, [game, altGame].filter(Boolean) as Game[], ['spreads', 'alternate_spreads']);
          const m2Combined = combineMarkets(b2.key, [game, altGame].filter(Boolean) as Game[], ['spreads', 'alternate_spreads']);

          // Flatten and merge the outcomes from both markets
          const outcomes1 = m1Combined.flatMap(m => m.outcomes);
          const outcomes2 = m2Combined.flatMap(m => m.outcomes);

          // Check for arbitrage between all combinations of outcomes
          outcomes1.forEach(o1 => {
            outcomes2.forEach(o2 => {
              const point1 = parseFloat(String(o1.point));
              const point2 = parseFloat(String(o2.point));

              // Ensure that point values are numbers and valid
              if (isNaN(point1) || isNaN(point2)) {
                return;
              }

              // Check if the points are valid for comparison and that we are not comparing the same team
              if (point1 !== point2 && checkArbitrage(o1.price, o2.price)) {
                // Ensure the teams are not the same
                const team1 = o1.name === 'Home' ? game.home_team : o1.name === 'Away' ? game.away_team : o1.name;
                const team2 = o2.name === 'Home' ? game.home_team : o2.name === 'Away' ? game.away_team : o2.name;

                if (team1 === team2) return;

                // Valid arbitrage check (opposite signs or same positive values)
                const isValidArb =
                  (point1 === -point2) || (point1 > 0 && point2 > 0 && point1 === point2);


                if (isValidArb) {
                  allBets.push(
                    <Box
                      key={`${game.home_team}-${game.away_team}-${b1.key}-${b2.key}-${team1}-${team2}-${point1}-${point2}`}
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
                        {b1.title}: {team1} {point1 > 0 ? `+${point1}` : point1} @ {o1.price}
                      </Text>
                      <Text fontWeight="bold" fontSize="md" color="blue.600">
                        {b2.title}: {team2} {point2 > 0 ? `+${point2}` : point2} @ {o2.price}
                      </Text>
                      <Text fontWeight="bold" color="red.500">
                        Arbitrage!
                      </Text>
                    </Box>
                  );
                }
              }
            });
          });
        }
      });
    });
  });

  return allBets;
};


const renderTotalArbitrage = (games: Game[], altGames: Game[]): JSX.Element[] => {
  const allBets: JSX.Element[] = [];

  games.forEach(game => {
    const altGame = altGames.find(g => g.home_team === game.home_team && g.away_team === game.away_team);

    game.bookmakers.forEach(b1 => {
      game.bookmakers.forEach(b2 => {
        if (b1.key !== b2.key) {
          const m1Combined = combineMarkets(b1.key, [game, altGame].filter(Boolean) as Game[], ['totals', 'alternate_totals']);
          const m2Combined = combineMarkets(b2.key, [game, altGame].filter(Boolean) as Game[], ['totals', 'alternate_totals']);

          const o1s = m1Combined.flatMap(m => m.outcomes.filter(o => o.name === 'Over'));
          const o2s = m2Combined.flatMap(m => m.outcomes.filter(o => o.name === 'Under'));

          o1s.forEach(o1 => {
            o2s.forEach(o2 => {
              if (
                o1.point !== undefined &&
                o2.point !== undefined &&
                o1.point <= o2.point &&
                checkArbitrage(o1.price, o2.price)
              ) {
                allBets.push(
                  <Box
                    key={`${game.home_team}-${game.away_team}-${b1.key}-${b2.key}-${o1.point}-${o2.point}`}
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
                      {b1.title}: Over {o1.point} @ {o1.price}
                    </Text>
                    <Text fontWeight="bold" fontSize="md" color="blue.600">
                      {b2.title}: Under {o2.point} @ {o2.price}
                    </Text>
                    <Text fontWeight="bold" color="red.500">
                      Arbitrage!
                    </Text>
                  </Box>
                );
              }
            });
          });
        }
      });
    });
  });

  return allBets;
};

export const renderArbitrageBets = (
  games: Game[],
  marketKey: string,
  altGames: Game[] = []
): JSX.Element[] => {
  switch (marketKey) {
    case 'h2h':
      return renderH2HArbitrage(games);
    case 'spreads':
      return renderSpreadArbitrage(games, altGames); 
    case 'totals':
      return renderTotalArbitrage(games, altGames);
    default:
      return [];
  }
};
