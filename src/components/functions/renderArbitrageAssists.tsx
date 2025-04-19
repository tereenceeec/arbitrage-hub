import React, { JSX } from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { calculateProfitPercent } from "./calculateProfitPercent";
import { useNavigate } from "react-router-dom";
import { useArbitrage } from "../functions/arbitrageContext";
interface Outcome {
  name: string;
  price: number;
  point?: number;
  description: string;
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

export const renderArbitrageAssists = (games: Game[]): JSX.Element => {
  const playerPropsArbitrage: { jsx: JSX.Element; profit: number }[] = [];

  const extractCombinedPlayerAssists = (markets?: Market[]) => {
    const main =
      markets?.find((m) => m.key === "player_assists")?.outcomes || [];
    const alt =
      markets?.find((m) => m.key === "player_assists_alternate")?.outcomes || [];
    return [...main, ...alt];
  };

  games.forEach((game) => {
    const players: Record<
      string,
      Record<string, { overs: Outcome[]; unders: Outcome[] }>
    > = {};

    game.bookmakers.forEach((bookmaker) => {
      const combinedOutcomes = extractCombinedPlayerAssists(bookmaker.markets);
      if (!combinedOutcomes.length) return;

      combinedOutcomes.forEach((outcome) => {
        const playerName = outcome.description;
        if (!players[playerName]) players[playerName] = {};
        if (!players[playerName][bookmaker.title])
          players[playerName][bookmaker.title] = { overs: [], unders: [] };

        if (outcome.name === "Over") {
          players[playerName][bookmaker.title].overs.push(outcome);
        } else if (outcome.name === "Under") {
          players[playerName][bookmaker.title].unders.push(outcome);
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

          odds1.overs.forEach((over) => {
            odds2.unders.forEach((under) => {
              if (
                over.point !== undefined &&
                under.point !== undefined &&
                over.point <= under.point &&
                checkArbitrage(over.price, under.price)
              ) {
                const profit = calculateProfitPercent(
                  over.price,
                  under.price,
                  1000
                );

                const Card = () => {
                  const navigate = useNavigate();
                  const { setData } = useArbitrage();

                  const handleClick = () => {
                    setData({ oddsA: over.price, oddsB: under.price });
                    navigate("/arbitrage-betting/");
                  };

                  return (
                    <Box
                      onClick={handleClick}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      transition="0.2s"
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
                        <strong>{bk1} (Over):</strong> {over.price} (Line: {over.point})
                      </Text>
                      <Text fontSize="sm">
                        <strong>{bk2} (Under):</strong> {under.price} (Line: {under.point})
                      </Text>
                      <Text fontWeight="bold" color="red.500">
                        Arbitrage!
                      </Text>
                      <Text fontWeight="bold" color="red.500">
                        Profit: {profit.toFixed(2)}%
                      </Text>
                    </Box>
                  );
                };

                playerPropsArbitrage.push({
                  jsx: <Card key={`arb-${game.home_team}-${playerName}-${over.point}-${under.point}`} />,
                  profit,
                });
              }
            });
          });
        }
      }
    });
  });

  const sorted = playerPropsArbitrage.sort((a, b) => b.profit - a.profit);

  return (
    <Grid
      templateColumns={{ base: "1fr", sm: "1fr", md: "repeat(3, 1fr)" }}
      gap={5}
      py={5}
    >
      {sorted.length > 0 ? (
        sorted.map((item, idx) => <React.Fragment key={idx}>{item.jsx}</React.Fragment>)
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
