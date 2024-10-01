import React from 'react';
import validator from 'validator';
import './PasswordStrengthMeter.css';

function PasswordStrengthMeter({ password }) {
  const rules = [
    { test: (pwd) => validator.isLength(pwd, { min: 8 }), message: "Au moins 8 caractères" },
    { test: (pwd) => /[A-Z]/.test(pwd), message: "Au moins une majuscule" },
    { test: (pwd) => /[a-z]/.test(pwd), message: "Au moins une minuscule" },
    { test: (pwd) => /\d/.test(pwd), message: "Au moins un chiffre" },
    { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), message: "Au moins un caractère spécial" }
  ];

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '' };

    const strength = rules.filter(rule => rule.test(password)).length * 20;

    let label;
    if (strength === 0) label = 'Très faible';
    else if (strength <= 20) label = 'Faible';
    else if (strength <= 40) label = 'Passable';
    else if (strength <= 60) label = 'Moyen';
    else if (strength <= 80) label = 'Fort';
    else label = 'Très fort';

    return { strength, label };
  };

  const { strength, label } = getPasswordStrength();

  return (
      <div className="password-strength-meter">
        <div className="strength-meter">
          <div className="strength-bar" style={{ width: `${strength}%`, backgroundColor: getColor(strength) }}></div>
        </div>
        <p className="strength-label">Force du mot de passe: <span style={{ color: getColor(strength) }}>{label}</span></p>
        <div className="password-rules">
          {rules.map((rule, index) => (
              <div key={index} className={`rule ${rule.test(password) ? 'valid' : 'invalid'}`}>
                <span className="rule-icon">{rule.test(password) ? '✓' : '✗'}</span>
                <span className="rule-text">{rule.message}</span>
              </div>
          ))}
        </div>
      </div>
  );
}

function getColor(strength) {
  if (strength <= 20) return '#ff4d4d';
  if (strength <= 40) return '#ffa64d';
  if (strength <= 60) return '#ffff4d';
  if (strength <= 80) return '#4dff4d';
  return '#4d4dff';
}

export default PasswordStrengthMeter;