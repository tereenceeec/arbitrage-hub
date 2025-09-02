import React, { useEffect, useState } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { fetchNFLTotalOdds, fetchNFLGameIds, fetchAlternateNFLTotals } from '../../api';
import { renderArbitrageBets, Game } from '../../components/functions/renderArbitrageBets';
import { renderOdds } from '../../components/functions/renderOdds';

const TotalsNFL = () => {
  const [totals, setTotals] = useState<Game[]>([]);
  const [combinedTotals, setCombinedTotals] = useState<Game[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const totalData = await fetchNFLTotalOdds();
        setTotals(totalData);
        const eventIds = await fetchNFLGameIds();
        const altTotals = await fetchAlternateNFLTotals(eventIds);
        setCombinedTotals([...totalData, ...altTotals]);
      } catch (e) {
        console.error('Failed to fetch NFL total odds:', e);
      }
    };
    load();
  }, []);

  const totalArbs = renderArbitrageBets(combinedTotals, 'totals');

  return (
    <Box w="100%" p={4}>
      <Box mb={6}>
        <Heading as="h2" size="md" mb={3} color="teal.800">Total Arbitrage</Heading>
        <Flex direction="column" gap={4}>
          {totalArbs.length ? totalArbs.map((arb, index) => (<Box key={index}>{arb}</Box>)) : (
            <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">No arbitrage found.</Box>
          )}
        </Flex>
      </Box>

      <Box>
        <Heading as="h2" size="md" mb={3} color="teal.800">Total Odds</Heading>
        <Flex direction="column" gap={4}>{renderOdds(totals, 'totals')}</Flex>
      </Box>
    </Box>
  );
};

export default TotalsNFL;

