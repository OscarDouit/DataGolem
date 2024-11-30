import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import useUserStore from '../../store/userStore';
import styles from './AuthPages.module.css';
import { FaUser, FaLock } from 'react-icons/fa';

function LoginPage() {
    const [pseudoMail, setPseudoMail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { checkAuth } = useUserStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/users/login', {
                pseudoMail,
                password,
            });

            if (response.status === 200) {
                await checkAuth();
                const from = location.state?.from || '/';
                navigate(from);
            }
        } catch (err) {
            setError('Email ou mot de passe incorrect');
            console.error('Erreur de connexion:', err);
        }
    };

    return (
        <div className={styles['authentification-container']}>
            <div className={`${styles['auth-container']} ${styles['auth-container-login']}`}>
                <div className={styles['auth-form-container']}>
                    <h1>Connexion</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles['input-icon-wrapper']}>
                            <FaUser className={styles['input-icon']} />
                            <input
                                type="text"
                                placeholder="Pseudo ou adresse e-mail"
                                value={pseudoMail}
                                onChange={(e) => setPseudoMail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles['input-icon-wrapper']}>
                            <FaLock className={styles['input-icon']} />
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className={styles['error-message']}>{error}</p>}
                        <button type="submit">Se connecter</button>
                    </form>
                    <p className={styles['link-text']}>
                        Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
                    </p>
                </div>
                <div className={styles['auth-image']}>
                    <h2>Bienvenue !</h2>
                    <p>Connectez-vous pour accéder à votre compte</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;