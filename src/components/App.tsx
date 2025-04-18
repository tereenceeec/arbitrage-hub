import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Spacer,
  Text,
  Image,
  VStack,
  useBreakpointValue,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Routes,
  Route,
  Link as RouterLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import Home from "../pages/Home";
import PlayerPropsAssists from "../pages/playerPropsAssists";
import H2hSpreadTotal from "../pages/h2hSpreadTotal";
import PlayerPropsRebounds from "../pages/playerPropsRebounds";
import PlayerPropsPoints from "../pages/playerPropsPoints";
import Login from "./ui/login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = () => {
    const storedUsername = localStorage.getItem("username");
    setIsLoggedIn(true);
    setUsername(storedUsername);
    navigate("/arbitrage-betting/");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername(null);
  };

  const navItems = [
    { name: "Home", path: "/arbitrage-betting/" },
    {
      name: "H2H - Spreads - Totals",
      path: "/arbitrage-betting/h2h-spread-total",
    },
    {
      name: "Player Props - Assists",
      path: "/arbitrage-betting/player-props-assists",
    },
    {
      name: "Player Props - Rebounds",
      path: "/arbitrage-betting/player-props-rebounds",
    },
    {
      name: "Player Props - Points",
      path: "/arbitrage-betting/player-props-points",
    },
  ];

  const getNavItemStyle = (path: string) => {
    // Apply active styles when the path matches the current location
    return location.pathname === path
      ? { bg: "teal.500", color: "white", fontWeight: "bold" } // Active state styles
      : { bg: "teal.800", color: "white" }; // Default state styles
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box p={4}>
      {/* Banner Section */}
      <Box
        bgGradient="linear(to-r, teal.800, teal.500)"
        color="white"
        p={6}
        borderRadius="md"
        mb={6}
        boxShadow="lg"
      >
        <Flex
          align="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          gap={6}
          textAlign={{ base: "center", md: "left" }}
        >
          <Box mr='auto' ml={['auto', 'unset']}>
          <Image
            src="/arbitrage-betting/images/abt-logo-colour.png"
            alt="ABT Logo"
            maxW="80px"
            borderRadius="lg"
            boxShadow="md"
            
            
          />
          </Box>
          <Box w='100%' textAlign='center'>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
              Welcome to Arbitrage Betting!
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} mt={2}>
              Find the best betting opportunities with ease. Maximize your
              profits by leveraging arbitrage betting.
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Navigation Bar with Gradient */}
      <Flex
        as="nav"
        mb={6}
        align="center"
        justify="space-between"
        bgGradient="linear(to-r, teal.800, teal.500)" // Gradient added here
        p={4}
        borderRadius="md"
        boxShadow="md"
        wrap="wrap"
      >
        {/* Mobile Hamburger */}
        {isMobile ? (
          <>
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Open menu"
              colorScheme="teal"
              variant="outline"
              onClick={onOpen}
            />
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px" color="teal.700">
                  Navigation
                </DrawerHeader>
                <DrawerBody>
                  <VStack spacing={4} align="stretch" mt={4}>
                    {navItems.map(({ name, path }) => (
                      <Button
                        as={RouterLink}
                        to={path}
                        key={name}
                        variant="ghost"
                        justifyContent="start"
                        onClick={onClose}
                        {...getNavItemStyle(path)} // Apply active styles
                      >
                        {name}
                      </Button>
                    ))}
                    <Button
                      colorScheme="red"
                      variant="solid"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <>
            <Flex wrap="wrap" align="center" gap={2}>
              {navItems.map(({ name, path }, idx) => (
                <Flex key={name} align="center">
                  <Button
                    as={RouterLink}
                    to={path}
                    variant="solid"
                    borderRadius="md"
                    fontSize="lg"
                    px={4}
                    py={2}
                    transition="all 0.2s"
                    _hover={{ bg: "teal.700" }}
                    _active={{ bg: "teal.900" }}
                    {...getNavItemStyle(path)} // Apply active styles
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
            <Flex align="center" gap={4}>
              {username && (
                <Box color="white" fontWeight="bold" mr={2}>
                  Logged in as:{" "}
                  <Text as="span" color="teal.200">
                    {username}
                  </Text>
                </Box>
              )}
              <Button
                colorScheme="red"
                variant="solid"
                size="sm"
                borderRadius="md"
                onClick={handleLogout}
                _hover={{ bg: "red.600" }}
                _active={{ bg: "red.700" }}
              >
                Log Out
              </Button>
            </Flex>
          </>
        )}
      </Flex>

      {/* Routes */}
      <Routes>
        <Route path="/arbitrage-betting/" element={<Home />} />
        <Route
          path="/arbitrage-betting/h2h-spread-total"
          element={<H2hSpreadTotal />}
        />
        <Route
          path="/arbitrage-betting/player-props-assists"
          element={<PlayerPropsAssists />}
        />
        <Route
          path="/arbitrage-betting/player-props-rebounds"
          element={<PlayerPropsRebounds />}
        />
        <Route
          path="/arbitrage-betting/player-props-points"
          element={<PlayerPropsPoints />}
        />
      </Routes>
    </Box>
  );
};

export default App;
