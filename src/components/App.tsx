import { useEffect, useState } from 'react';
import { Box, Flex, Button, Spacer } from '@chakra-ui/react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';

import Home from '../pages/Home';
import PlayerPropsAssists from '../pages/playerPropsAssists';
import H2hSpreadTotal from '../pages/h2hSpreadTotal';
import PlayerPropsRebounds from '../pages/playerPropsRebounds';
import PlayerPropsPoints from '../pages/playerPropsPoints';
import Login from './ui/login';
import { useNavigate } from 'react-router-dom';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'H2H - Spreads - Totals', path: '/h2h-spread-total' },
    { name: 'Player Props - Assists', path: '/player-props-assists' },
    { name: 'Player Props - Rebounds', path: '/player-props-rebounds' },
    { name: 'Player Props - Points', path: '/player-props-points' }
  ];

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box p={4}>
      {/* Navigation Bar */}
      <Flex
        as="nav"
        mb={6}
        align="center"
        justify="space-between"
        bg="teal.800"
        p={4}
        borderRadius="md"
        boxShadow="md"
      >
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
                _hover={{ bg: 'teal.700' }}
                _active={{ bg: 'teal.900' }}
              >
                {name}
              </Button>
              {idx < navItems.length - 1 && (
                <Box height="28px" width="1px" bg="whiteAlpha.600" mx={2} />
              )}
            </Flex>
          ))}
        </Flex>
        <Spacer />
        <Button
          colorScheme="red"
          variant="solid"
          size="sm"
          borderRadius="md"
          onClick={handleLogout}
          _hover={{ bg: 'red.600' }}
          _active={{ bg: 'red.700' }}
        >
          Log Out
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
