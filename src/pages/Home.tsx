import { Box, Heading, Text, List, ListItem, OrderedList, Button } from '@chakra-ui/react';

const Home = () => {
  return (
    <Box p={4} bg="gray.50" borderRadius="md" boxShadow="lg">
      {/* Page Title */}
      <Heading as="h2" size="xl" mb={4} color="teal.800" fontWeight="bold">
        Welcome to the NBA Betting Arbitrage Tool!
      </Heading>
      
      {/* Introduction Text */}
      <Text fontSize="lg" mb={6} color="gray.700">
        Are you looking to maximize your profits and minimize risks in NBA betting? You're in the right place! This tool helps you spot arbitrage opportunities in real-time, allowing you to take advantage of differing odds across multiple bookmakers.
      </Text>

      <Text fontSize="md" mb={6} color="gray.600">
        Arbitrage betting is a technique that involves placing bets on all possible outcomes of a game with different bookmakers, ensuring a guaranteed profit regardless of the result. By exploiting discrepancies in odds, you can make money even when the game’s outcome is uncertain.
      </Text>

      {/* Features List */}
      <Heading as="h3" size="lg" mb={4} color="teal.700">
        Key Features:
      </Heading>
      <List spacing={3} mb={6} color="gray.600">
        <ListItem>
          <strong>Real-Time Arbitrage Opportunities:</strong> Find the best odds for player props, spreads, and totals across multiple bookmakers.
        </ListItem>
        <ListItem>
          <strong>Player Props Analysis:</strong> Dive deep into player props like points, assists, and rebounds for both over and under markets.
        </ListItem>
        <ListItem>
          <strong>H2H Spreads & Totals:</strong> Get insights on head-to-head spreads and total bets for every NBA game.
        </ListItem>
        <ListItem>
          <strong>Easy-to-Use Interface:</strong> Enjoy a user-friendly design that makes finding and calculating arbitrage bets quick and easy.
        </ListItem>
        <ListItem>
          <strong>Dynamic Betting Data:</strong> Get the latest odds and market data updated in real-time to help you make informed decisions.
        </ListItem>
      </List>

      {/* How Arbitrage Works */}
      <Heading as="h3" size="lg" mb={4} color="teal.700">
        How Arbitrage Betting Works:
      </Heading>
      <Text fontSize="md" mb={4} color="gray.600">
        To calculate arbitrage opportunities, you need to compare the odds for different outcomes of a game. For example, if one bookmaker offers a better price for the "Over" on assists and another for the "Under", combining these bets creates an arbitrage opportunity. Here's how it's calculated:
      </Text>
      
      <OrderedList mb={6} color="gray.600">
        <ListItem>
          <strong>Step 1:</strong> Identify the markets with differing odds from multiple bookmakers.
        </ListItem>
        <ListItem>
          <strong>Step 2:</strong> Calculate the implied probability of each outcome using the odds.
        </ListItem>
        <ListItem>
          <strong>Step 3:</strong> Place bets on each outcome in such a way that your combined stakes guarantee a profit regardless of the result.
        </ListItem>
        <ListItem>
          <strong>Step 4:</strong> Lock in your profits by betting on all potential outcomes of the game, ensuring your risk is minimized.
        </ListItem>
      </OrderedList>

      {/* Call to Action */}
      <Button 
        colorScheme="teal" 
        variant="solid" 
        size="lg" 
        borderRadius="md" 
        _hover={{
          bg: 'teal.600', 
          transform: 'scale(1.05)', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        _active={{
          bg: 'teal.700', 
          transform: 'scale(1.03)',
        }}
      >
        Start Finding Arbitrage Bets Now!
      </Button>
    </Box>
  );
};

export default Home;
