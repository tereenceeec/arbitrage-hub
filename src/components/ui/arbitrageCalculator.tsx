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
  const [totalStake, setTotalStake] = useState('1000');
  const [stakeA, setStakeA] = useState('');
  const [stakeB, setStakeB] = useState('');
  const [lastChanged, setLastChanged] = useState<'total' | 'a' | 'b' | null>('total');

  useEffect(() => {
    if (data) {
      setOddsA(data.oddsA.toString());
      setOddsB(data.oddsB.toString());
      setData(null); // Clear after using
    }
  }, [data]);

  const parsedOddsA = parseFloat(oddsA);
  const parsedOddsB = parseFloat(oddsB);
  const parsedTotalStake = parseFloat(totalStake);
  const parsedStakeA = parseFloat(stakeA);
  const parsedStakeB = parseFloat(stakeB);

  const isValid = !isNaN(parsedOddsA) && !isNaN(parsedOddsB);

  // Calculate bet distribution
  const arbPercent = isValid ? (1 / parsedOddsA) + (1 / parsedOddsB) : 0;
  const isArb = isValid && arbPercent < 1;

  // Sync stakes based on user input
  useEffect(() => {
    if (!isValid || arbPercent === 0) return;

    if (lastChanged === 'total') {
      const betA = (parsedTotalStake * (1 / parsedOddsA)) / arbPercent;
      const betB = (parsedTotalStake * (1 / parsedOddsB)) / arbPercent;
      setStakeA(betA.toFixed(2));
      setStakeB(betB.toFixed(2));
    } else if (lastChanged === 'a') {
      const betB = (parsedStakeA * (1 / parsedOddsB)) / (1 / parsedOddsA);
      const total = parsedStakeA + betB;
      setStakeB(betB.toFixed(2));
      setTotalStake(total.toFixed(2));
    } else if (lastChanged === 'b') {
      const betA = (parsedStakeB * (1 / parsedOddsA)) / (1 / parsedOddsB);
      const total = parsedStakeB + betA;
      setStakeA(betA.toFixed(2));
      setTotalStake(total.toFixed(2));
    }
  }, [parsedTotalStake, parsedStakeA, parsedStakeB, parsedOddsA, parsedOddsB, arbPercent, lastChanged]);

  const payoutA = parseFloat(stakeA || '0') * parsedOddsA;
  const payoutB = parseFloat(stakeB || '0') * parsedOddsB;
  const guaranteedReturn = Math.min(payoutA, payoutB);
  const total = parseFloat(totalStake);
  const profit = guaranteedReturn - total;
  const profitPercent = (profit / total) * 100;

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

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <FormControl>
            <FormLabel fontWeight="semibold">Stake on Side A ($)</FormLabel>
            <Input
              type="number"
              value={stakeA}
              onChange={(e) => {
                setStakeA(e.target.value);
                setLastChanged('a');
              }}
              placeholder="e.g. 600"
              focusBorderColor="teal.400"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold">Stake on Side B ($)</FormLabel>
            <Input
              type="number"
              value={stakeB}
              onChange={(e) => {
                setStakeB(e.target.value);
                setLastChanged('b');
              }}
              placeholder="e.g. 400"
              focusBorderColor="teal.400"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold">Total Stake ($)</FormLabel>
            <Input
              type="number"
              value={totalStake}
              onChange={(e) => {
                setTotalStake(e.target.value);
                setLastChanged('total');
              }}
              placeholder="e.g. 1000"
              focusBorderColor="teal.400"
            />
          </FormControl>
        </SimpleGrid>

        {isValid && (
          <Fade in={true}>
            <Box mt={4}>
              <Heading size="md" mb={3}>
                🧮 Bet Distribution
              </Heading>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Stat>
                  <StatLabel>Side A</StatLabel>
                  <StatNumber>${stakeA}</StatNumber>
                  <StatHelpText>Return: ${payoutA.toFixed(2)}</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Side B</StatLabel>
                  <StatNumber>${stakeB}</StatNumber>
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
