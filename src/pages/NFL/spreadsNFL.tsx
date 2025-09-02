import React, { useEffect, useState } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { fetchNFLSpreadOdds, fetchNFLGameIds, fetchAlternateNFLSpreads } from '../../api';
import { renderArbitrageBets, Game } from '../../components/functions/renderArbitrageBets';
import { renderOdds } from '../../components/functions/renderOdds';

const SpreadsNFL = () => {
  const [spreads, setSpreads] = useState<Game[]>([]);
  const [combinedSpreads, setCombinedSpreads] = useState<Game[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const spreadData = await fetchNFLSpreadOdds();
        setSpreads(spreadData);
        const eventIds = await fetchNFLGameIds();
        const altSpreads = await fetchAlternateNFLSpreads(eventIds);
        setCombinedSpreads([...spreadData, ...altSpreads]);
      } catch (e) {
        console.error('Failed to fetch NFL spread odds:', e);
      }
    };
    load();
  }, []);

  const spreadArbs = renderArbitrageBets(combinedSpreads, 'spreads');

  return (
    <Box w="100%" p={4}>
      <Box mb={6}>
        <Heading as="h2" size="md" mb={3} color="teal.800">Spread Arbitrage</Heading>
        <Flex direction="column" gap={4}>
          {spreadArbs.length ? spreadArbs.map((arb, index) => (<Box key={index}>{arb}</Box>)) : (
            <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">No arbitrage found.</Box>
          )}
        </Flex>
      </Box>

      <Box>
        <Heading as="h2" size="md" mb={3} color="teal.800">Spread Odds</Heading>
        <Flex direction="column" gap={4}>{renderOdds(spreads, 'spreads')}</Flex>
      </Box>
    </Box>
  );
};

export default SpreadsNFL;

