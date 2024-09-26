import React from 'react';
import AppBar from "./components/AppBar/AppBar.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import './App.css';

const App = () => {
    return (
        <div>
            <AppBar />
            <HomePage />
        </div>
    );
}

export default App;