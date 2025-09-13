import React from 'react';

interface SimplePageProps {
  title: string;
  description: string;
  features: string[];
}

const SimplePage: React.FC<SimplePageProps> = ({ title, description, features }) => {
  return (
    <div className="simple-page">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="feature-placeholder">
        <h3>主な機能:</h3>
        <ul>
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SimplePage;
