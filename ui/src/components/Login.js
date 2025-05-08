import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Anchor, Stack, Center, Container, Group } from '@mantine/core';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      login(data.access_token, username);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Container size={420} my={40}>
        <Title align="center" order={2} mb="md">
          Sign in to your account
        </Title>
        <Paper withBorder shadow="md" p={30} radius="md">
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <Text color="red" size="sm" align="center">
                  {error}
                </Text>
              )}
              <Button type="submit" fullWidth mt="md" color="blue">
                Sign in
              </Button>
            </Stack>
          </form>
          <Group position="apart" mt="md" mb="xs">
            <Text size="sm" color="dimmed">
              Or
            </Text>
          </Group>
          <Text align="center" size="sm">
            Don't have an account?{' '}
            <Anchor component={Link} to="/signup" color="blue">
              Sign up
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Center>
  );
} 