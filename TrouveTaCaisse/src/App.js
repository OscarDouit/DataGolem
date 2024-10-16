import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Authentification/LoginPage.jsx';
import SignupPage from './pages/Authentification/SignupPage.jsx';
import HomePage from "./pages/HomePage/HomePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;