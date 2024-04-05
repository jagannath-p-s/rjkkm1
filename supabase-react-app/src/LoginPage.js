import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from './supabase'; // Import Supabase client instance
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 20px auto 0; /* Added margin-top */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black; /* Changed button color to black */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ErrorMsg = styled.p`
  color: red;
  margin-top: 10px;
`;

function LoginPage({ setAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = async () => {
    try {
      // Get user data from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
  
      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('User not found');
      }
  
      // Compare unhashed password with provided password
      const isValidPassword = data.password === password;
  
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }
  
      // Set authentication state if password is valid
      setAuthenticated(true);
    } catch (error) {
      console.error('Error signing in:', error.message);
      setError(error.message);
    }
  };
  

  return (
    <LoginContainer>
      <Title>Login</Title>
      <Input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={signIn}>Sign In</Button>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </LoginContainer>
  );
}

export default LoginPage;
