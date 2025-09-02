import React, { useEffect, useState } from 'react';
import {
  fetchNFLH2HOdds,
  fetchNFLSpreadOdds,
  fetchNFLTotalOdds,
  fetchNFLGameIds,
  fetchAlternateNFLTotals,
  fetchAlternateNFLSpreads,
} from '../api';

import { renderArbitrageBets, Game } from '../components/functions/renderArbitrageBets';
import { renderOdds } from '../components/functions/renderOdds';
import { Box, Heading, Divider, Flex, Grid } from '@chakra-ui/react';

const H2hSpreadTotalNFL = () => {
  const [h2hOdds, setH2HOdds] = useState<Game[]>([]);
  const [spreadOdds, setSpreadOdds] = useState<Game[]>([]);
  const [totalOdds, setTotalOdds] = useState<Game[]>([]);
  const [combinedTotals, setCombinedTotals] = useState<Game[]>([]);
  const [combinedSpreads, setCombinedSpreads] = useState<Game[]>([]);

  useEffect(() => {
    const getOdds = async () => {
      try {
        const h2hData = await fetchNFLH2HOdds();
        const spreadData = await fetchNFLSpreadOdds();
        const totalData = await fetchNFLTotalOdds();
        const eventIds = await fetchNFLGameIds();
        const altTotalsData = await fetchAlternateNFLTotals(eventIds);
        const altSpreadsData = await fetchAlternateNFLSpreads(eventIds);

        const allTotals = [...totalData, ...altTotalsData];
        const allSpreads = [...spreadData, ...altSpreadsData];

        setH2HOdds(h2hData);
        setSpreadOdds(spreadData);
        setTotalOdds(totalData);
        setCombinedSpreads(allSpreads);
        setCombinedTotals(allTotals);
      } catch (error) {
        console.error('Failed to fetch NFL odds:', error);
      }
    };

    getOdds();
  }, []);

  const h2hArbs = renderArbitrageBets(h2hOdds, 'h2h');
  const spreadArbs = renderArbitrageBets(combinedSpreads, 'spreads');
  const totalArbs = renderArbitrageBets(combinedTotals, 'totals');

  return (
    <Box w="100%" p={4}>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={6}>
        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            H2H Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {h2hArbs.length ? h2hArbs.map((arb, index) => (<Box key={index}>{arb}</Box>)) : (
              <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">
                No arbitrage found.
              </Box>
            )}
          </Flex>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            Spread Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {spreadArbs.length ? spreadArbs.map((arb, index) => (<Box key={index}>{arb}</Box>)) : (
              <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">
                No arbitrage found.
              </Box>
            )}
          </Flex>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            Total Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {totalArbs.length ? totalArbs.map((arb, index) => (<Box key={index}>{arb}</Box>)) : (
              <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">
                No arbitrage found.
              </Box>
            )}
          </Flex>
        </Box>
      </Grid>

      <Divider borderColor="teal.300" my={6} />

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={6}>
        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            H2H Odds
          </Heading>
          <Flex direction="column" gap={4}>{renderOdds(h2hOdds, 'h2h')}</Flex>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            Spread Odds
          </Heading>
          <Flex direction="column" gap={4}>{renderOdds(spreadOdds, 'spreads')}</Flex>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={3} color="teal.800">
            Total Odds
          </Heading>
          <Flex direction="column" gap={4}>{renderOdds(totalOdds, 'totals')}</Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default H2hSpreadTotalNFL;


