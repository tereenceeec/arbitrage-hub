import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  OrderedList,
  Button,
  Flex,
  VStack,
  useBreakpointValue,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FiTrendingUp, FiZap } from "react-icons/fi";
import ArbitrageCalculator from "../components/ui/arbitrageCalculator";
import { useEffect } from "react";

const Home = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  useEffect(() => {
    const showWelcome = localStorage.getItem('showWelcomeMessage');
    const username = localStorage.getItem('username');

    if (showWelcome === 'true' && username === 'davidc') {
      toast({
        title: 'A wild fat man has appeared!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });

      // Remove the flag so it doesn't show again
      localStorage.removeItem('showWelcomeMessage');
    }
  }, [toast]);

  return (
    <Box bgGradient="linear(to-br, gray.50, teal.50)" minH="100vh" p={6}>
      {/* Header */}
      <Box textAlign="center" mb={12}>
        <Heading size="3xl" fontWeight="bold" color="teal.700" mb={4}>
          🧠 Arbitrage Hub
        </Heading>
        <Text fontSize="xl" color="gray.700" maxW="800px" mx="auto">
          Discover real-time arbitrage opportunities, calculate guaranteed
          profits, and make smarter bets across multiple markets.
        </Text>
      </Box>

      {/* Main Section */}
      <Flex
        direction={isMobile ? "column" : "row"}
        gap={10}
        maxW="1200px"
        mx="auto"
        align="start"
        justify="center"
      >
        <ArbitrageCalculator />

        {/* Right: Info Panels */}
        <VStack flex="1" spacing={8} align="stretch" maxW="600px" width="100%">
          {/* Features Card */}
          <Box p={6} bg="white" borderRadius="2xl" boxShadow="xl">
            <Heading size="md" mb={4} color="teal.700">
              <Flex align="center" gap={2}>
                <Icon as={FiZap as any} />
                What You Can Do
              </Flex>
            </Heading>
            <List spacing={4} fontSize="md" color="gray.700">
              <ListItem>
                ✅ <strong>Live Arbitrage Detection:</strong> Spot real-time
                mismatches in odds.
              </ListItem>
              <ListItem>
                ✅ <strong>Calculator Tool:</strong> Auto-split stakes for
                profit.
              </ListItem>
              <ListItem>
                ✅ <strong>Coverage:</strong> H2H, Spreads, Totals, Player
                Props.
              </ListItem>
              <ListItem>
                ✅ <strong>Updated Odds:</strong> Data refreshes continuously.
              </ListItem>
            </List>
          </Box>

          {/* How It Works Card */}
          <Box p={6} bg="white" borderRadius="2xl" boxShadow="xl">
            <Heading size="md" mb={4} color="teal.700">
              <Flex align="center" gap={2}>
                <Icon as={FiTrendingUp as any} boxSize={5} />
                How Arbitrage Betting Works
              </Flex>
            </Heading>
            <Text fontSize="md" mb={4} color="gray.600">
              Place bets on all possible outcomes across different sportsbooks
              for a no-risk profit.
            </Text>
            <OrderedList spacing={3} fontSize="md" color="gray.700">
              <ListItem>Find opposite value on different books.</ListItem>
              <ListItem>Calculate implied probabilities from odds.</ListItem>
              <ListItem>Use the calculator to split your stake.</ListItem>
              <ListItem>Place both bets. Guaranteed profit.</ListItem>
            </OrderedList>

            <Flex justify="center" mt={6}>
              <Button
                as="a"
                href="/arbitrage-hub/nba/h2h-spread-total"
                colorScheme="teal"
                size="lg"
                borderRadius="xl"
                px={8}
                py={6}
                fontWeight="bold"
                _hover={{ boxShadow: "lg", transform: "scale(1.03)" }}
              >
                🚀 Explore Opportunities
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Home;
