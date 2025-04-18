import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Text,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';

const ArbitrageCalculator = () => {
  const [oddsA, setOddsA] = useState('2.6');
  const [oddsB, setOddsB] = useState('1.9');
  const [stake, setStake] = useState('1000');

  const parsedOddsA = parseFloat(oddsA);
  const parsedOddsB = parseFloat(oddsB);
  const parsedStake = parseFloat(stake);

  const isValid = !isNaN(parsedOddsA) && !isNaN(parsedOddsB) && !isNaN(parsedStake);
  const arbPercent = isValid ? (1 / parsedOddsA) + (1 / parsedOddsB) : 0;
  const isArb = isValid && arbPercent < 1;

  const betA = isValid ? (parsedStake * (1 / parsedOddsA)) / arbPercent : 0;
  const betB = isValid ? (parsedStake * (1 / parsedOddsB)) / arbPercent : 0;
  const payoutA = betA * parsedOddsA;
  const payoutB = betB * parsedOddsB;

  const guaranteedReturn = Math.min(payoutA, payoutB);
  const profit = guaranteedReturn - parsedStake;
  const profitPercent = (profit / parsedStake) * 100;

  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box
      maxW="500px"
      w="100%"
      mx="auto"
      bg={bg}
      p={5}
      borderRadius="2xl"
    >
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center" color="teal.600">
          Arbitrage Calculator
        </Heading>

        <FormControl>
          <FormLabel>Odds for Side A</FormLabel>
          <Input
            value={oddsA}
            onChange={(e) => setOddsA(e.target.value)}
            placeholder="e.g. 2.60"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Odds for Side B</FormLabel>
          <Input
            value={oddsB}
            onChange={(e) => setOddsB(e.target.value)}
            placeholder="e.g. 1.90"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Total Stake</FormLabel>
          <Input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            placeholder="e.g. 1000"
          />
        </FormControl>

        {isValid && (
          <>
            <Box mt={4}>
              <Text fontSize="lg">
                <strong>Bet on Side A:</strong> ${betA.toFixed(2)}
              </Text>
              <Text fontSize="md" color="gray.500" ml={4}>
                Return: ${payoutA.toFixed(2)}
              </Text>

              <Text fontSize="lg" mt={3}>
                <strong>Bet on Side B:</strong> ${betB.toFixed(2)}
              </Text>
              <Text fontSize="md" color="gray.500" ml={4}>
                Return: ${payoutB.toFixed(2)}
              </Text>
            </Box>

            <Box mt={2} p={4} borderRadius="md" bg={isArb ? 'green.50' : 'red.50'}>
              <Text fontSize="md" color={isArb ? 'green.600' : 'red.600'}>
                {isArb
                  ? `✅ Arbitrage opportunity detected!`
                  : `⚠️ No arbitrage – you'd lose money.`}
              </Text>
              <Text fontSize="lg" mt={1}>
                Profit: <strong>${profit.toFixed(2)}</strong> ({profitPercent.toFixed(2)}%)
              </Text>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ArbitrageCalculator;
