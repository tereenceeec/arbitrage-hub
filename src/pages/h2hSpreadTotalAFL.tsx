import React, { useEffect, useState } from "react";
import {
  fetchAFLGameIds,
  fetchAlternateAFLSpreads,
  fetchAlternateAFLTotals,
  fetchH2HAFLOdds,
  fetchSpreadAFLOdds,
  fetchTotalAFLOdds,
} from "../api";

import {
  renderArbitrageBets,
  Game,
} from "../components/functions/renderArbitrageBets";
import { renderOdds } from "../components/functions/renderOdds";
import { Box, Heading, Divider, Flex, Grid } from "@chakra-ui/react";

const H2hSpreadTotalAFL = () => {
  const [h2hOdds, setH2HOdds] = useState<Game[]>([]);
  const [spreadOdds, setSpreadOdds] = useState<Game[]>([]);
  const [totalOdds, setTotalOdds] = useState<Game[]>([]);

  useEffect(() => {
    const getOdds = async () => {
      try {
        const [h2hData, spreadData, totalData, gameIds] = await Promise.all([
          fetchH2HAFLOdds(),
          fetchSpreadAFLOdds(),
          fetchTotalAFLOdds(),
          fetchAFLGameIds(),
        ]);

        const [alternateSpreadData, alternateTotalData] = await Promise.all([
          fetchAlternateAFLSpreads(gameIds),
          fetchAlternateAFLTotals(gameIds),
        ]);

        const mergedSpreads = [...spreadData, ...alternateSpreadData];
        const mergedTotals = [...totalData, ...alternateTotalData];

        setH2HOdds(h2hData);
        setSpreadOdds(mergedSpreads);
        setTotalOdds(mergedTotals);
      } catch (error) {
        console.error("Failed to fetch AFL odds:", error);
      }
    };

    getOdds();
  }, []);

  const h2hArbs = renderArbitrageBets(h2hOdds, "h2h");
  const spreadArbs = renderArbitrageBets(spreadOdds, "spreads");
  const totalArbs = renderArbitrageBets(totalOdds, "totals");

  return (
    <Box w="100%" p={4}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6}>
        {/* H2H Arbitrage */}
        <Box>
          <Heading as="h2" size="md" mb={3} color="green.800">
            AFL H2H Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {h2hArbs.length ? (
              h2hArbs.map((arb, index) => <Box key={index}>{arb}</Box>)
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
          </Flex>
        </Box>

        {/* Spread Arbitrage */}
        <Box>
          <Heading as="h2" size="md" mb={3} color="green.800">
            AFL Spread Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {spreadArbs.length ? (
              spreadArbs.map((arb, index) => <Box key={index}>{arb}</Box>)
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
          </Flex>
        </Box>

        {/* Total Arbitrage */}
        <Box>
          <Heading as="h2" size="md" mb={3} color="green.800">
            AFL Total Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {totalArbs.length ? (
              totalArbs.map((arb, index) => <Box key={index}>{arb}</Box>)
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
          </Flex>
        </Box>
      </Grid>

      <Divider borderColor="green.300" my={6} />

      {/* AFL Odds Display */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6}>
        <Box>
          <Heading as="h2" size="md" mb={3} color="green.800">
            AFL H2H Odds
          </Heading>
          <Flex direction="column" gap={4}>
            {renderOdds(h2hOdds, "h2h")}
          </Flex>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={3} color="green.800">
            AFL Spread Odds
          </Heading>
          <Flex direction="column" gap={4}>
            {renderOdds(spreadOdds, "spreads")}
          </Flex>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={3} color="green.800">
            AFL Total Odds
          </Heading>
          <Flex direction="column" gap={4}>
            {renderOdds(totalOdds, "totals")}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default H2hSpreadTotalAFL;
