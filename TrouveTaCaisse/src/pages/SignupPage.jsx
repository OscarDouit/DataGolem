import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import validator from 'validator';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter/PasswordStrengthMeter';
import './AuthPages.css';
// Importation des icônes
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

function SignupPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    if (password.length < minLength) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas)) {
      return "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation des champs
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'Ce champ est obligatoire';
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!validator.isEmail(formData.email)) {
      newErrors.email = 'Adresse e-mail invalide';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('/users', formData);
      navigate('/');
    } catch (err) {
      console.log("erreur !!!", err.response?.data);
      if (err.response && err.response.data) {
        // Initialiser un nouvel objet d'erreurs
        const newErrors = {};
        // Parcourir les champs de la réponse d'erreur
        Object.keys(err.response.data).forEach(key => {
          newErrors[key] = err.response.data[key];
        });
        // Ajouter une erreur générale si aucune erreur spécifique n'est fournie
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = 'Une erreur est survenue lors de l\'inscription';
        }
        setErrors(newErrors);
      } else {
        setErrors({ general: 'Une erreur est survenue lors de l\'inscription' });
      }
    }
  };

  return (
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Créer un compte</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                  type="text"
                  name="firstname"
                  placeholder="Prénom"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
              />
            </div>
            {errors.firstname && <p className="error-message">{errors.firstname}</p>}

            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                  type="text"
                  name="lastname"
                  placeholder="Nom"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
              />
            </div>
            {errors.lastname && <p className="error-message">{errors.lastname}</p>}

            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                  type="text"
                  name="pseudo"
                  placeholder="Pseudo"
                  value={formData.pseudo}
                  onChange={handleChange}
                  required
              />
            </div>
            {errors.pseudo && <p className="error-message">{errors.pseudo}</p>}

            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                  type="email"
                  name="email"
                  placeholder="Adresse e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
              />
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}

            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
              />
            </div>
            <PasswordStrengthMeter password={formData.password} />
            {errors.password && <p className="error-message">{errors.password}</p>}

            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
              />
            </div>
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

            <button type="submit">Créer un compte</button>
          </form>
          <p>
            Déjà un compte ? <Link to="/">Se connecter</Link>
          </p>
        </div>
        <div className="auth-image">
          <h2>Rejoignez-nous !</h2>
          <p>Créez votre compte pour accéder à toutes nos fonctionnalités</p>
        </div>
      </div>
  );
}

export default SignupPage;