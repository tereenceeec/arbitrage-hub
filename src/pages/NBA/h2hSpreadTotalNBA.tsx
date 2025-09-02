import React, { useEffect, useState } from 'react';
import {
  fetchNBAH2HOdds,
  fetchNBASpreadOdds,
  fetchGameIds,
  fetchNBATotalOdds,
  fetchAlternateTotals,
  fetchAlternateSpreads,
} from '../../api';

import { renderArbitrageBets, Game } from '../../components/functions/renderArbitrageBets';
import { renderOdds } from '../../components/functions/renderOdds';
import { Box, Heading, Divider, Flex, Grid } from '@chakra-ui/react';

const H2hSpreadTotalNBA = () => {
  const [h2hOdds, setH2HOdds] = useState<Game[]>([]);
  const [spreadOdds, setSpreadOdds] = useState<Game[]>([]);
  const [totalOdds, setTotalOdds] = useState<Game[]>([]);
  const [combinedTotals, setCombinedTotals] = useState<Game[]>([]); // Combined totals (regular + alternate totals)
  const [combinedSpreads, setCombinedSpreads] = useState<Game[]>([]); // Combined spreads (regular + alternate spreads)

  useEffect(() => {
    const getOdds = async () => {
      try {
        const h2hData = await fetchNBAH2HOdds();
        const spreadData = await fetchNBASpreadOdds();
        const totalData = await fetchNBATotalOdds(); // Regular totals
        const eventIds = await fetchGameIds();
        const altTotalsData = await fetchAlternateTotals(eventIds); // Alternate totals
        const altSpreadsData = await fetchAlternateSpreads(eventIds); // Alternate spreads

        // Combine totals and alternate totals for arbitrage
        const allTotals = [...totalData, ...altTotalsData];
        const allSpreads = [...spreadData, ...altSpreadsData];

        setH2HOdds(h2hData);
        setSpreadOdds(spreadData);       // Regular spreads only
        setTotalOdds(totalData);         // Regular totals only
        setCombinedSpreads(allSpreads);  // For arbitrage
        setCombinedTotals(allTotals);    // For arbitrage
      } catch (error) {
        console.error('Failed to fetch odds:', error);
      }
    };

    getOdds();
  }, []);

  const h2hArbs = renderArbitrageBets(h2hOdds, 'h2h');
  const spreadArbs = renderArbitrageBets(combinedSpreads, 'spreads');  // Arbitrage from full spreads
  const totalArbs = renderArbitrageBets(combinedTotals, 'totals');     // Arbitrage from full totals

  return (
    <Box w="100%" p={4}>
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} // 1 column for mobile and 3 for larger screens
        gap={6}
      >
        {/* H2H Arbitrage Section */}
        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            H2H Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {h2hArbs.length ? (
              h2hArbs.map((arb, index) => (
                <Box key={index}>
                  {arb}
                </Box>
              ))
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

        {/* Spread Arbitrage Section */}
        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            Spread Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {spreadArbs.length ? (
              spreadArbs.map((arb, index) => (
                <Box key={index}>
                  {arb}
                </Box>
              ))
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

        {/* Total Arbitrage Section */}
        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            Total Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {totalArbs.length ? (
              totalArbs.map((arb, index) => (
                <Box key={index}>
                  {arb}
                </Box>
              ))
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

      <Divider borderColor="teal.300" my={6} />

      {/* H2H Odds Section */}
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} // 1 column for mobile and 3 for larger screens
        gap={6}
      >
        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            H2H Odds
          </Heading>
          <Flex direction="column" gap={4}>
            {renderOdds(h2hOdds, 'h2h')}
          </Flex>
        </Box>

        {/* Spread Odds Section */}
        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            Spread Odds
          </Heading>
          <Flex direction="column" gap={4}>
            {renderOdds(spreadOdds, 'spreads')}
          </Flex>
        </Box>

        {/* Total Odds Section */}
        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            Total Odds
          </Heading>
          <Flex direction="column" gap={4}>
            {renderOdds(totalOdds, 'totals')}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default H2hSpreadTotalNBA;


