import React from 'react';

const GameCard = ({ title, description, image }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', maxWidth: '300px' }}>
            <img src={image} alt={title} style={{ width: '100%', borderRadius: '8px' }} />
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
};

// Dummy data
const dummyGame = {
    title: 'Outlandish Adventure',
    description: 'Embark on the most bizarre and thrilling journey ever imagined.',
    image: 'https://via.placeholder.com/300'
};

// Render the component with dummy data
const App = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <GameCard 
                title={dummyGame.title} 
                description={dummyGame.description} 
                image={dummyGame.image} 
            />
        </div>
    );
};

export default GameCard;