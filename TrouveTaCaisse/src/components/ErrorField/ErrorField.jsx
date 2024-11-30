import React from 'react';

const ErrorField = ({ errorMessage }) => {
    return (
         <span className="error-message">{errorMessage}</span>
    );
}

export default ErrorField;