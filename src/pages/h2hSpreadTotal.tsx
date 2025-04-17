import React, { useEffect, useState } from 'react';
import { fetchH2HOdds, fetchSpreadOdds, fetchTotalOdds } from '../api';
import { renderArbitrageBets, Game } from '../components/functions/renderArbitrageBets';
import { renderOdds } from '../components/functions/renderOdds';
import { Box, Heading, Divider, Flex } from '@chakra-ui/react';

const H2hSpreadTotal = () => {
  const [h2hOdds, setH2HOdds] = useState<Game[]>([]);
  const [spreadOdds, setSpreadOdds] = useState<Game[]>([]);
  const [totalOdds, setTotalOdds] = useState<Game[]>([]);

  useEffect(() => {
    const getOdds = async () => {
      try {
        const h2hData = await fetchH2HOdds();
        const spreadData = await fetchSpreadOdds();
        const totalData = await fetchTotalOdds();

        setH2HOdds(h2hData);
        setSpreadOdds(spreadData);
        setTotalOdds(totalData);
      } catch (error) {
        console.error('Failed to fetch odds:', error);
      }
    };

    getOdds();
  }, []);

  const h2hArbs = renderArbitrageBets(h2hOdds, 'h2h');
  const spreadArbs = renderArbitrageBets(spreadOdds, 'spreads');
  const totalArbs = renderArbitrageBets(totalOdds, 'totals');

  return (
    <Flex gap={6} justify="space-between" w="100%">
      {/* Section Template */}
      {[
        { label: 'H2H', arbs: h2hArbs, odds: h2hOdds, key: 'h2h' },
        { label: 'Spread', arbs: spreadArbs, odds: spreadOdds, key: 'spreads' },
        { label: 'Total', arbs: totalArbs, odds: totalOdds, key: 'totals' },
      ].map(({ label, arbs, odds, key }) => (
        <Box key={key} w="33%">
          <Heading as="h2" size="md" mb={3} color="teal.800">
            {label} Arbitrage
          </Heading>
          <Flex direction="column" gap={4} mb={6}>
            {arbs.length ? (
              arbs.map((arb, index) => (
                <Box
                  key={index}
                >
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

          <Divider borderColor="teal.300" mb={4} />

          <Heading as="h2" size="md" mb={3} color="teal.800">
            {label} Odds
          </Heading>
          <Flex direction="column" gap={4}>
            {renderOdds(odds, key)}
          </Flex>
        </Box>
      ))}
    </Flex>
  );
};

export default H2hSpreadTotal;
