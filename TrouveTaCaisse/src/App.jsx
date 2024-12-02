import React from 'react';
import AppBar from "./components/AppBar/AppBar.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import CarPage from './pages/CarPage/CarPage.jsx';
import LoginPage from './pages/Authentification/LoginPage.jsx';
import SignupPage from './pages/Authentification/SignupPage.jsx';
import SearchPage from './pages/SearchPage/SearchPage.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import useUserStore from './store/userStore';
import './App.css';

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
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;