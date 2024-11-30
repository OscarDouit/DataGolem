import React from 'react';
import AppBar from "./components/AppBar/AppBar.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import CarPage from './pages/CarPage/CarPage.jsx';
import './App.css';
import LoginPage from './pages/Authentification/LoginPage.jsx';
import SignupPage from './pages/Authentification/SignupPage.jsx';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import useUserStore from './store/userStore';

function App() {
    const { checkAuth } = useUserStore();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>
            <AppBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/car/:id" element={<CarPage />} />
            </Routes>
        </>
    );
}

export default App;