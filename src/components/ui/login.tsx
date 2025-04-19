import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Text,
  useToast,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { FiUser, FiLock } from "react-icons/fi"; // Icon library for input fields

const hardcodedUsers = [
  { username: "admin", password: "Qwerty123" },
  { username: "terencec", password: "Qwerty123" },
  { username: "davidc", password: "Qwerty123" },
];

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  const handleLogin = () => {
    const user = hardcodedUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user.username);
      // Set a flag to show a toast only for davidc
      if (user.username === "davidc") {
        localStorage.setItem("showWelcomeMessage", "true");
      }
      onLogin();
    } else {
      setError("Invalid username or password");
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-r, teal.600, teal.700)"
      px={4}
      flexDirection="column"
    >
      <Box mb={6}>
        <Text
          fontSize="5xl"
          fontWeight="bold"
          color="white"
          letterSpacing="wide"
          textShadow="2px 2px 4px rgba(0,0,0,0.6)"
        >
          Arbitrage Hub
        </Text>
      </Box>

      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={8}
        rounded="xl"
        boxShadow="lg"
        width="100%"
        maxW="420px"
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "xl",
          transform: "translateY(-5px)",
        }}
      >
        <VStack spacing={6} align="stretch">
          <Heading
            textAlign="center"
            size="lg"
            color="teal.600"
            letterSpacing="wider"
          >
            Sign In
          </Heading>

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiUser as any} color="teal.500" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                focusBorderColor="teal.500"
                borderRadius="lg"
                _placeholder={{ color: "gray.400" }}
                fontWeight="semibold"
              />
            </InputGroup>
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiLock as any} color="teal.500" />
              </InputLeftElement>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                focusBorderColor="teal.500"
                borderRadius="lg"
                _placeholder={{ color: "gray.400" }}
                fontWeight="semibold"
              />
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            size="lg"
            fontWeight="bold"
            borderRadius="lg"
            _hover={{
              bg: "teal.700",
              boxShadow: "lg",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s ease-in-out"
          >
            Log In
          </Button>
        </VStack>
      </Box>

      <Text mt={4} fontSize="sm" color="white" textAlign="center">
        New here?{" "}
        <a href="#" style={{ color: "white", fontWeight: "bold" }}>
          Sign up
        </a>
      </Text>
    </Flex>
  );
};

export default Login;
