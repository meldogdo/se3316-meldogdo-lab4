import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';
import CreateAccount from './CreateAccount';
import UpdatePassword from './UpdatePassword';
import SearchPage from './SearchPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;
