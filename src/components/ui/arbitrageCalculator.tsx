import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  VStack,
  Text,
  Input,
  useColorModeValue,
  Divider,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Fade,
  SimpleGrid,
} from '@chakra-ui/react';
import { useArbitrage } from '../functions/arbitrageContext';

const ArbitrageCalculator = () => {
  const { data, setData } = useArbitrage();

  const [oddsA, setOddsA] = useState('2.6');
  const [oddsB, setOddsB] = useState('1.9');
  const [stake, setStake] = useState('1000');

  useEffect(() => {
    if (data) {
      setOddsA(data.oddsA.toString());
      setOddsB(data.oddsB.toString());
      setData(null); // Clear after using
    }
  }, [data]);

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
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      maxW="600px"
      w="100%"
      mx="auto"
      bg={bg}
      p={9}
      borderRadius="2xl"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">
          🎯 Arbitrage Calculator
        </Heading>

        <Divider />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          <FormControl>
            <FormLabel fontWeight="semibold">Odds for Side A</FormLabel>
            <Input
              type="number"
              value={oddsA}
              onChange={(e) => setOddsA(e.target.value)}
              placeholder="e.g. 2.60"
              focusBorderColor="teal.400"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold">Odds for Side B</FormLabel>
            <Input
              type="number"
              value={oddsB}
              onChange={(e) => setOddsB(e.target.value)}
              placeholder="e.g. 1.90"
              focusBorderColor="teal.400"
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel fontWeight="semibold">Total Stake ($)</FormLabel>
          <Input
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            placeholder="e.g. 1000"
            focusBorderColor="teal.400"
          />
        </FormControl>

        {isValid && (
          <Fade in={true}>
            <Box mt={4}>
              <Heading size="md" mb={3}>
                🧮 Bet Distribution
              </Heading>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Stat>
                  <StatLabel>Side A</StatLabel>
                  <StatNumber>${betA.toFixed(2)}</StatNumber>
                  <StatHelpText>Return: ${payoutA.toFixed(2)}</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Side B</StatLabel>
                  <StatNumber>${betB.toFixed(2)}</StatNumber>
                  <StatHelpText>Return: ${payoutB.toFixed(2)}</StatHelpText>
                </Stat>
              </SimpleGrid>

              <Box
                mt={6}
                p={5}
                borderRadius="lg"
                bg={isArb ? 'green.50' : 'red.50'}
                border="1px solid"
                borderColor={isArb ? 'green.300' : 'red.300'}
              >
                <Text fontSize="md" color={isArb ? 'green.600' : 'red.600'}>
                  {isArb
                    ? `✅ Arbitrage opportunity detected!`
                    : `⚠️ No arbitrage — you'd lose money.`}
                </Text>
                <Text fontSize="xl" fontWeight="bold" mt={2}>
                  Profit: ${profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                </Text>
              </Box>
            </Box>
          </Fade>
        )}
      </VStack>
    </Box>
  );
};

export default ArbitrageCalculator;
