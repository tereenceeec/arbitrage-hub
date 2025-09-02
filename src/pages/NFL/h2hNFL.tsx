import React, { useEffect, useState } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { fetchNFLH2HOdds } from '../../api';
import { renderArbitrageBets, Game } from '../../components/functions/renderArbitrageBets';
import { renderOdds } from '../../components/functions/renderOdds';

const H2HNFL = () => {
  const [h2hOdds, setH2HOdds] = useState<Game[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNFLH2HOdds();
        setH2HOdds(data);
      } catch (e) {
        console.error('Failed to fetch NFL H2H odds:', e);
      }
    };
    load();
  }, []);

  const h2hArbs = renderArbitrageBets(h2hOdds, 'h2h');

  return (
    <Box w="100%" p={4}>
      <Box mb={6}>
        <Heading as="h2" size="md" mb={3} color="teal.800">H2H Arbitrage</Heading>
        <Flex direction="column" gap={4}>
          {h2hArbs.length ? h2hArbs.map((arb, index) => (<Box key={index}>{arb}</Box>)) : (
            <Box p={4} textAlign="center" border="1px dashed" borderColor="gray.300" borderRadius="md" color="gray.500">No arbitrage found.</Box>
          )}
        </Flex>
      </Box>

      <Box>
        <Heading as="h2" size="md" mb={3} color="teal.800">H2H Odds</Heading>
        <Flex direction="column" gap={4}>{renderOdds(h2hOdds, 'h2h')}</Flex>
      </Box>
    </Box>
  );
};

export default H2HNFL;

