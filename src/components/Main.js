import React from 'react';
import '../styles/Main.css';

const Main = ({ title, description, children }) => {
  const formattedDescription = `Home / ${description}`;

  return (
    <main>
      <div className="header-section">
        <div className="main-title">{title}</div>
        <div className="breadcrumb">
          {formattedDescription.split('/').map((part, index, arr) => (
            <span key={index} className={index === arr.length - 1 ? 'breadcrumb-last' : ''}>
              {index === arr.length - 1 ? (
                <strong style={{ color: 'white' }}>{part.trim()}</strong>
              ) : (
                `${part.trim()} / `
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="conteudo">
        {children}
      </div>
    </main>
  );
};

export default Main;
