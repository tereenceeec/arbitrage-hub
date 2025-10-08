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
import PlayerPropsAssistsNBA from "../pages/NBA/playerPropsAssistsNBA";
import H2HNBA from "../pages/NBA/h2hNBA";
import SpreadsNBA from "../pages/NBA/spreadsNBA";
import TotalsNBA from "../pages/NBA/totalsNBA";
import PlayerPropsReboundsNBA from "../pages/NBA/playerPropsReboundsNBA";
import PlayerPropsPointsNBA from "../pages/NBA/playerPropsPointsNBA";
import Login from "./ui/login";
import H2hSpreadTotalAFL from "../pages/AFL/h2hSpreadTotalAFL";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import PlayerPropsQBNFL from "../pages/NFL/PlayerPropsQBNFL";
import H2HNFL from "../pages/NFL/h2hNFL";
import SpreadsNFL from "../pages/NFL/spreadsNFL";
import TotalsNFL from "../pages/NFL/totalsNFL";

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
    navigate("/arbitrage-hub/");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername(null);
  };

  const navNBAItems = [
    { name: "H2H", path: "/arbitrage-hub/nba/h2h" },
    { name: "Spreads", path: "/arbitrage-hub/nba/spreads" },
    { name: "Totals", path: "/arbitrage-hub/nba/totals" },
    { name: "Player Props - Points", path: "/arbitrage-hub/nba/player-props/points" },
    { name: "Player Props - Rebounds", path: "/arbitrage-hub/nba/player-props/rebounds" },
    { name: "Player Props - Assists", path: "/arbitrage-hub/nba/player-props/assists" },
  ];

  const navAFLItems = [
    { name: "H2H - Spreads - Totals", path: "/arbitrage-hub/afl/h2h-spread-total" },
  ];

  const navNFLItems = [
    { name: "H2H", path: "/arbitrage-hub/nfl/h2h" },
    { name: "Spreads", path: "/arbitrage-hub/nfl/spreads" },
    { name: "Totals", path: "/arbitrage-hub/nfl/totals" },
    { name: "Player Props - QB", path: "/arbitrage-hub/nfl/player-props/qb" },
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
    <Box mr="auto" ml={["auto", "unset"]}>
      <Image
        src="/arbitrage-hub/images/abt-logo-colour.png"
        alt="ABT Logo"
        maxW="80px"
        borderRadius="lg"
        boxShadow="md"
      />
    </Box>
    <Box w="100%" textAlign="center">
      <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
        Unlock Every Edge.
      </Text>
      <Text fontSize={{ base: "md", md: "lg" }} mt={2} opacity={0.85}>
        Track value. Beat the books. Bet smarter.
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
                    <Button as={RouterLink} to="/arbitrage-hub/" variant="ghost" justifyContent="start" onClick={onClose} {...getNavItemStyle("/arbitrage-hub/")}>Home</Button>

                    <Text fontWeight="bold" color="teal.700">NBA</Text>
                    {navNBAItems.map(({ name, path }) => (
                      <Button as={RouterLink} to={path} key={name} variant="ghost" justifyContent="start" onClick={onClose} {...getNavItemStyle(path)}>
                        {name}
                      </Button>
                    ))}

                    <Text fontWeight="bold" color="teal.700">AFL</Text>
                    {navAFLItems.map(({ name, path }) => (
                      <Button as={RouterLink} to={path} key={name} variant="ghost" justifyContent="start" onClick={onClose} {...getNavItemStyle(path)}>
                        {name}
                      </Button>
                    ))}

                    <Text fontWeight="bold" color="teal.700">NFL</Text>
                    {navNFLItems.map(({ name, path }) => (
                      <Button as={RouterLink} to={path} key={name} variant="ghost" justifyContent="start" onClick={onClose} {...getNavItemStyle(path)}>
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
              <Button as={RouterLink} to="/arbitrage-hub/" variant="solid" borderRadius="md" fontSize="lg" px={4} py={2} transition="all 0.2s" _hover={{ bg: "teal.700" }} _active={{ bg: "teal.900" }} {...getNavItemStyle("/arbitrage-hub/")}>Home</Button>
              <Box height="28px" width="1px" bg="whiteAlpha.600" mx={2} />

              <Menu>
                <MenuButton as={Button} rightIcon={<HamburgerIcon />} {...getNavItemStyle("/arbitrage-hub/nba")}>NBA</MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nba/h2h">H2H</MenuItem>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nba/spreads">Spreads</MenuItem>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nba/totals">Totals</MenuItem>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nba/player-props/points">Player Props - Points</MenuItem>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nba/player-props/rebounds">Player Props - Rebounds</MenuItem>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nba/player-props/assists">Player Props - Assists</MenuItem>
                </MenuList>
              </Menu>

              <Box height="28px" width="1px" bg="whiteAlpha.600" mx={2} />

              <Menu>
                <MenuButton as={Button} rightIcon={<HamburgerIcon />} {...getNavItemStyle("/arbitrage-hub/afl")}>AFL</MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/afl/h2h-spread-total">H2H - Spreads - Totals</MenuItem>
                </MenuList>
              </Menu>

              <Box height="28px" width="1px" bg="whiteAlpha.600" mx={2} />

              <Menu>
                <MenuButton as={Button} rightIcon={<HamburgerIcon />} {...getNavItemStyle("/arbitrage-hub/nfl")}>NFL</MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nfl/h2h">H2H</MenuItem>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nfl/spreads">Spreads</MenuItem>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nfl/totals">Totals</MenuItem>
                  <MenuItem as={RouterLink} to="/arbitrage-hub/nfl/player-props/qb">Player Props - QB</MenuItem>
                </MenuList>
              </Menu>
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
        <Route path="/arbitrage-hub/" element={<Home />} />
        <Route path="/arbitrage-hub/nba/h2h" element={<H2HNBA />} />
        <Route path="/arbitrage-hub/nba/spreads" element={<SpreadsNBA />} />
        <Route path="/arbitrage-hub/nba/totals" element={<TotalsNBA />} />
        <Route path="/arbitrage-hub/nba/player-props/assists" element={<PlayerPropsAssistsNBA />} />
        <Route path="/arbitrage-hub/nba/player-props/rebounds" element={<PlayerPropsReboundsNBA />} />
        <Route path="/arbitrage-hub/nba/player-props/points" element={<PlayerPropsPointsNBA />} />
        <Route path="/arbitrage-hub/afl/h2h-spread-total" element={<H2hSpreadTotalAFL />} />
        <Route path="/arbitrage-hub/nfl/h2h" element={<H2HNFL />} />
        <Route path="/arbitrage-hub/nfl/spreads" element={<SpreadsNFL />} />
        <Route path="/arbitrage-hub/nfl/totals" element={<TotalsNFL />} />
        <Route path="/arbitrage-hub/nfl/player-props/qb" element={<PlayerPropsQBNFL />} />
      </Routes>
    </Box>
  );
};

export default App;
