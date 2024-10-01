import React from 'react';
import AppBar from "./components/AppBar/AppBar.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Route, Routes } from 'react-router-dom';

function App() {
    return (
        <>
            <AppBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </>
    );
}

export default App;