import React from 'react';
import '../styles/NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img
                src="https://cdn-icons-png.flaticon.com/512/3398/3398611.png"
                alt="Page Not Found"
                className="not-found-image"
            />
            <h1 className="not-found-title">Oops! Página não encontrada.</h1>
            <p className="not-found-text">
                A página que você está procurando está temporariamente indisponível.
            </p>
        </div>
    );
};

export default NotFound;