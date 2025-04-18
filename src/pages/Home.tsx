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
} from "@chakra-ui/react";
import ArbitrageCalculator from "../components/ui/arbitrageCalculator";

const Home = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex direction="column" align="center" p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Box textAlign="center" mb={10} width="100%">
        <Heading size="2xl" fontWeight="extrabold" color="teal.700" mb={4}>
          NBA Betting Arbitrage Tool
        </Heading>
        <Text fontSize="xl" color="gray.700" maxW="800px" mx="auto">
          Discover profitable betting opportunities across bookmakers. Use our
          real-time arbitrage detection and calculator to lock in guaranteed
          profits.
        </Text>
      </Box>

      {/* Main Content */}
      <Flex
        direction={isMobile ? "column" : "row"}
        gap={8}
        width="100%"
        maxW="1200px"
        align="start"
        justify="center"
      >
        {/* Left - Calculator */}
        <Box
          flex="1"
          bg="white"
          p={6}
          borderRadius="2xl"
          boxShadow="md"
          width="100%"
          maxWidth={isMobile ? "100%" : "500px"}
          textAlign='center'
        >
          <Heading size="lg" color="teal.700" mb={7}>
            Arbitrage Calculator
          </Heading>
          <Text fontSize="md" mb={9} color="gray.600">
            Enter odds and your total stake to calculate how much to bet on each
            outcome for a guaranteed return.
          </Text>
          <ArbitrageCalculator />
        </Box>

        {/* Right - Features and How It Works */}
        <VStack
          flex="1"
          spacing={6}
          align="stretch"
          width="100%"
          maxWidth={isMobile ? "100%" : "600px"}
        >
          {/* What You Can Do */}
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="md">
            <Heading size="lg" color="teal.700" mb={4}>
              What You Can Do
            </Heading>
            <List spacing={4} fontSize="md" color="gray.700">
              <ListItem>
                ✅ <strong>Use Arbitrage Calculator:</strong> Calculate stake
                splits and profits instantly.
              </ListItem>
              <ListItem>
                ✅ <strong>Scan Arbitrage Opportunities:</strong> Find value
                from odds differences in real time.
              </ListItem>
              <ListItem>
                ✅ <strong>Full Market Coverage:</strong> Analyze:
                <List pl={6} pt={2} spacing={1}>
                  <ListItem>• H2H (Head-to-Head)</ListItem>
                  <ListItem>• Spreads</ListItem>
                  <ListItem>• Totals (Over/Under)</ListItem>
                  <ListItem>
                    • Player Props (Assists, Rebounds, Points)
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                ✅ <strong>Live Odds Sync:</strong> Data updates constantly for
                the latest betting edge.
              </ListItem>
            </List>
          </Box>

          {/* How It Works */}
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="md">
            <Heading size="lg" color="teal.700" mb={4}>
              How Arbitrage Betting Works
            </Heading>
            <Text fontSize="md" mb={4} color="gray.600">
              Arbitrage betting lets you place bets on all outcomes with
              different bookmakers to ensure a profit. Here’s how:
            </Text>
            <OrderedList spacing={3} color="gray.700" fontSize="md" mb={6}>
              <ListItem>
                Identify bookmakers offering opposite value on a market.
              </ListItem>
              <ListItem>
                Calculate the implied probability from the odds.
              </ListItem>
              <ListItem>
                Use the calculator to determine ideal bet amounts for each side.
              </ListItem>
              <ListItem>
                Place both bets and lock in profit — regardless of outcome.
              </ListItem>
            </OrderedList>
            <Flex justify="center">
              <Button
                colorScheme="teal"
                size="lg"
                borderRadius="xl"
                px={8}
                py={6}
                fontSize={{ base: "md", sm: "lg", md: "xl" }} // Responsive font size
                _hover={{ boxShadow: "lg", transform: "scale(1.03)" }}
                href="/arbitrage-betting/h2h-spread-total"
                as="a"
              >
                Explore Arbitrage Opportunities
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Home;
