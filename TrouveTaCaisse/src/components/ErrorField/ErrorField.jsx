import React from 'react';
import './ErrorField.css';

const ErrorField = ({ errorMessage }) => {
    return (
        <div className="error-container">
            <span className="error-message">{errorMessage}</span>
        </div>
    );
}

export default ErrorField;