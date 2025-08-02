import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Game.module.css';

const Game = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentStep, setCurrentStep] = useState('character');

  const characters = [
    {
      id: 1,
      name: 'Aashish',
      image: '/character2.gif',
    },
    {
      id: 2,
      name: 'Pratishtha',
      image: '/girl2.png',
    },
  ];

  const worlds = [
    { id: 1, name: "Art with Picasso", image: 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/art_with_picasso.png' },
    { id: 2, name: "A trip to CERN", image: 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/cern.png' },
    { id: 3, name: "Cleopatra's Egypt", image: 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/cleopatras_egypt.png' },
    { id: 4, name: "The Great Barrier Reef", image: 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/great_barrier_reef.png' },
    { id: 5, name: "International Space Station", image: 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/international_space_station.png' },
    { id: 6, name: "Marie Curie's Lab", image: 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/marie_curies_lab.png' },
  ];

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setCurrentStep('world');
  };

  const handleBack = () => {
    setCurrentStep('character');
  }

  const handleWorldSelect = (world) => {
    if (!selectedCharacter || world.id !== 3) return; // Only allow Cleopatra's Egypt
    navigate('/game_scene', { 
      state: { 
        character: selectedCharacter.image, 
        companion: "/catgif.gif", 
        worldId: world.id, 
        background_image: "https://mnemo-assets.s3.ap-south-1.amazonaws.com/game_background_overview.jpeg" 
      } 
    });
  };

  return (
    <div className={styles.gameContainer}>
      {currentStep === 'character' ? (
        <div className={styles.selectionContainer}>
      <h2>Select Your Character</h2>
      <div className={styles.characterContainer}>
        {characters.map((character) => (
          <div
            key={character.id}
            className={`${styles.characterCard} ${selectedCharacter?.id === character.id ? styles.selected : ''}`}
            onClick={() => handleCharacterSelect(character)}
          >
            <img src={character.image} alt={character.name} className={styles.characterImage} />
            <p>{character.name}</p>
          </div>
        ))}
      </div>
      </div>

      ) : (
        <div className={styles.selectionContainer}>
          <button className={styles.backButton} onClick={handleBack}>
            Back to Character Selection
          </button>
      {/* World Selection */}
      <h2>Select Your World</h2>
      <div className={styles.worldContainer}>
        {worlds.map((world) => (
          <div
            key={world.id}
            className={`${styles.worldCard} ${world.id !== 3 ? styles.disabled : ''}`}
            onClick={() => world.id === 3 && handleWorldSelect(world)}
            style={{ cursor: world.id === 3 ? 'pointer' : 'not-allowed' }}
          >
            <img 
              src={world.image} 
              alt={world.name} 
              className={styles.worldImage}
              style={{ opacity: world.id === 3 ? 1 : 0.5 }}
            />
            <p>{world.name}</p>
          </div>
        ))}
      </div>
    </div>
  )}
  </div>
  );
}

export default Game;