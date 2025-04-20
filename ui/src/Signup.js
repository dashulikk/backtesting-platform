import { Text, Anchor,Container, Title, Paper, TextInput, PasswordInput, Button, Center } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigate = useNavigate();

  // Event handlers to update state when input changes
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
        Sign Up
      </Title>
      
      {/* Paper component provides a card-like form container */}
      <Paper radius="md" p="xl" withBorder>
        <form>
          {/* Username field */}
          <TextInput 
            label="Username" 
            placeholder="Enter your username" 
            required 
            size="md"
            style={{ marginBottom: 20 }}
            onChange={handleUsernameChange}
          />
          
          {/* Password field */}
          <PasswordInput 
            label="Password" 
            placeholder="Enter your password" 
            required 
            size="md" 
            style={{ marginBottom: 20 }}
            onChange={handlePasswordChange}
          />

          {/* Confirm Password field */}
          <PasswordInput 
            label="Confirm Password" 
            placeholder="Confirm your password" 
            required 
            size="md" 
            style={{ marginBottom: 20 }}
            onChange={handlePasswordConfirmChange}
          />
          
          {/* Login button */}
          <Button fullWidth size="md" type="submit" onClick={handleSubmit}>
            Sign Up
          </Button>
        </form>
      </Paper>
      <Center style={{ marginBottom: 10 }}>
           <Text>Already have an account? &nbsp;</Text>
            <Anchor target="_blank" underline="hover" onClick={() => {navigate("/login")}}>
                Sign in
            </Anchor>
        </Center>
    </Container>
    </Center>
  );
}

export default Signup;
