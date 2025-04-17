import React, { useState } from 'react';
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
} from '@chakra-ui/react';

const hardcodedUsers = [
  { username: 'admin', password: 'Qwerty123' },
  { username: 'terencec', password: 'Qwerty123' },
  { username: 'davidc', password: 'Qwerty123' }
];

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const handleLogin = () => {
    const user = hardcodedUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
    } else {
      setError('Invalid username or password');
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4} flexDirection={'column'} >
        <Box><Text fontSize='36' fontWeight={700} mb='30px' color="teal.700">Arbitrage Betting Tool</Text></Box>
      <Box
        bg="white"
        p={8}
        rounded="2xl"
        boxShadow="lg"
        width="100%"
        maxW="400px"
      >
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" size="lg" color="teal.700">
            Sign In
          </Heading>

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="teal.500"
            />
          </FormControl>

          <Button
            colorScheme="teal"
            onClick={handleLogin}
            size="lg"
            fontWeight="bold"
            _hover={{ boxShadow: 'md' }}
          >
            Log In
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
