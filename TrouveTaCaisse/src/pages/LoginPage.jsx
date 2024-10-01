import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../App.css';
import './AuthPages.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Ajout de l'état pour l'erreur
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            navigate('/dashboard');
        } catch (error) {
            console.error('Erreur de connexion:', error.response?.data);
            if (error.response && error.response.data) {
                // Supposons que le backend renvoie un objet avec un champ 'message' pour l'erreur générale
                setError(error.response.data.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.');
            } else {
                setError('Une erreur est survenue lors de la connexion');
            }
        }
    };

    return (
        <div className={'authentification-container'}>
            <div className="auth-container auth-container-login">
                <div className="auth-form-container">
                    <h1>Connexion</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Pseudo ou adresse e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit">Se connecter</button>
                    </form>
                    <p>
                        Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
                    </p>
                </div>
                <div className="auth-image">
                    <h2>Bienvenue !</h2>
                    <p>Connectez-vous pour accéder à votre compte</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;