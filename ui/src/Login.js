import { Text, Anchor,Container, Title, Paper, TextInput, PasswordInput, Button, Center, Group, Stack } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Event handlers to update state when input changes
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic using username and password
    console.log('Login attempt with:', { username, password });
  };

  return (
    <Center
      style={{
        height: '100vh',
      }}
    >
      <Container size={500} style={{ minWidth: 500 }} >
      {/* Center the form and add a title */}
      <Title align="center" style={{ marginBottom: 30 }}>
        Login
      </Title>
      
      {/* Paper component provides a card-like form container */}
      <Paper radius="md" p="xl" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack>
            {/* Username field */}
            <TextInput 
              label="Username" 
              placeholder="Enter your username" 
              required 
              size="md"
              style={{ marginBottom: 20 }}
              value={username}
              onChange={handleUsernameChange}
            />
            
            {/* Password field */}
            <TextInput 
              label="Password" 
              placeholder="Enter your password" 
              required 
              size="md" 
              style={{ marginBottom: 20 }}
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            
            {/* Login button */}
            <Group position="right">
              <Button color='yellow' fullWidth size="md" type="submit">
                Login
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
      <Center style={{ marginBottom: 10 }}>
           <Text>Don't have an account? &nbsp;</Text>
            <Anchor target="_blank" underline="hover" onClick={() => {navigate("/signup")}}>
                Sign up
            </Anchor>
        </Center>
    </Container>
    </Center>
  );
}

export default Login;
