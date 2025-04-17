import Home from '../pages/Home';
import PlayerPropsAssists from '../pages/playerPropsAssists';
import H2hSpreadTotal from '../pages/h2hSpreadTotal';
import PlayerPropsRebounds from '../pages/playerPropsRebounds';
import PlayerPropsPoints from '../pages/playerPropsPoints';
import { Box, Flex, Button, Spacer } from '@chakra-ui/react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';

const App = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'H2H - Spreads - Totals', path: '/h2h-spread-total' },
    { name: 'Player Props - Assists', path: '/player-props-assists' },
    { name: 'Player Props - Rebounds', path: '/player-props-rebounds' },
    { name: 'Player Props - Points', path: '/player-props-points' }
  ];

  return (
    <Box p={4}>
      {/* Navigation Bar */}
      <Flex as="nav" mb={6} align="center" justify="space-between" bg="teal.800" p={4} borderRadius="md" boxShadow="md">
        <Flex align="center">
          {navItems.map(({ name, path }, idx) => (
            <Flex key={name} align="center">
              <Button
                as={RouterLink}
                to={path}
                variant="solid"
                bg="teal.800"
                color="white"
                borderRadius="md"
                fontSize="lg"
                px={4}
                py={2}
                transition="all 0.2s"
                _hover={{
                  bg: 'teal.700',
                }}
                _active={{
                  bg: 'teal.900',
                }}
              >
                {name}
              </Button>
              {idx < navItems.length - 1 && (
                <Box
                  height="28px"
                  width="1px"
                  bg="whiteAlpha.600"
                  mx={2}
                />
              )}
            </Flex>
          ))}
        </Flex>
        <Spacer />
        {/* Sign In Button */}
        <Button
          colorScheme="teal"
          variant="solid"
          size="sm"
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
          Sign In
        </Button>
      </Flex>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/h2h-spread-total" element={<H2hSpreadTotal />} />
        <Route path="/player-props-assists" element={<PlayerPropsAssists />} />
        <Route path="/player-props-rebounds" element={<PlayerPropsRebounds />} />
        <Route path="/player-props-points" element={<PlayerPropsPoints />} />
      </Routes>
    </Box>
  );
};

export default App;
