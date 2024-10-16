import React from 'react';
import AppBar from "./components/AppBar/AppBar.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import './App.css';
import LoginPage from './pages/Authentification/LoginPage.jsx';
import SignupPage from './pages/Authentification/SignupPage.jsx';
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