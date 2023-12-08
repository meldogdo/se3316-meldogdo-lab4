import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link

const StartPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Define setIsLoggedIn
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/heros/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token); // Save the token (assuming it's in the response)
        navigate('/search'); // Navigate to the search page
      } else {
        console.error('Login failed:', data);
        setLoginMessage('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginMessage('Login failed: ' + error.message);
    }
  };
  

  return (
    <div>
      <h1>Unknown Flame</h1>
      <p>This is an application to find info about your favourite superheroes and add them to lists.</p>
      
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>

      {loginMessage && <p>{loginMessage}</p>}

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <p>
        Want to change your password? <Link to="/update-password">Update Password</Link>
      </p>
    </div>
  );
};

export default StartPage;
