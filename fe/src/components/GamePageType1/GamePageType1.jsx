import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GamePageType1.module.css';
import { FaArrowLeft } from 'react-icons/fa';

const planets = [
  { name: 'Mercury', gravity: 0.38, image: '/mercury.webp' },
  { name: 'Venus', gravity: 0.91, image: '/venus.webp' },
  { name: 'Earth', gravity: 1, image: '/earth.webp' },
  { name: 'Mars', gravity: 0.38, image: '/mars.webp' },
  { name: 'Jupiter', gravity: 2.34, image: '/jupiter.webp' },
  { name: 'Saturn', gravity: 1.06, image: '/saturn.webp' },
  { name: 'Uranus', gravity: 0.92, image: '/uranus.webp' },
  { name: 'Neptune', gravity: 1.19, image: '/neptune.webp' },
  { name: 'Pluto', gravity: 0.06, image: '/pluto.webp' }
];

function GamePageType1() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [earthWeight, setEarthWeight] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [weightsAdded, setWeightsAdded] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initParticles = () => {
      particles = [];
      const numParticles = 100;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: []
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Connect nearby particles
        particles.forEach((particle2, j) => {
          if (i !== j) {
            const dx = particle.x - particle2.x;
            const dy = particle.y - particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particle2.x, particle2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance/500})`;
              ctx.stroke();
            }
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const goToHome = () => {
    navigate('/');
  };

  const calculateWeight = (planetGravity) => {
    return Math.round(earthWeight * planetGravity);
  };

  const addWeight = (weight) => {
    const newTotal = currentWeight + weight;
    setWeightsAdded([...weightsAdded, weight]);
    setCurrentWeight(newTotal);
  };

  const removeWeight = (index) => {
    const removedWeight = weightsAdded[index];
    const newWeights = weightsAdded.filter((_, i) => i !== index);
    setWeightsAdded(newWeights);
    setCurrentWeight(currentWeight - removedWeight);
  };

  const resetGame = () => {
    setEarthWeight('');
    setSelectedPlanet(null);
    setWeightsAdded([]);
    setCurrentWeight(0);
    setShowOverlay(false);
  };

  const handleWeightInput = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) setEarthWeight(value);
  };

  useEffect(() => {
    if (selectedPlanet && currentWeight === calculateWeight(selectedPlanet.gravity)) {
      setShowOverlay(true);
    }
  }, [currentWeight, selectedPlanet]);

  return (
    <div className={styles.gamePage}>
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      <button className={styles.backButton} onClick={goToHome}>
        <FaArrowLeft /> Back to Home
      </button>

      {!selectedPlanet ? (
        <div className={styles.inputSection}>
          <h2>Enter your weight on Earth</h2>
          <input
            type="number"
            value={earthWeight}
            onChange={handleWeightInput}
            placeholder="Enter your weight in kg"
            className={styles.weightInput}
          />
          {earthWeight && (
            <div className={styles.planets}>
              <h3>Select a Planet</h3>
              <div className={styles.planetGrid}>
                {planets.map((planet, index) => (
                  <div
                    key={index}
                    className={styles.planet}
                    style={{ marginBottom: `${Math.random() * 50}px`, marginLeft: `${Math.random() * 30}px` }}
                    onClick={() => setSelectedPlanet(planet)}
                  >
                    <div className={styles.planetImage}>
                      <img
                        src={planet.image}
                        alt={planet.name}
                        className={styles.planetImageItem}
                      />
                      <span className={styles.planetName}>{planet.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.gameContainer}>
          <h2>{`Your Weight on ${selectedPlanet.name}: ${calculateWeight(selectedPlanet.gravity)} kg`}</h2>
          <div className={styles.weightControls}>
            <div className={styles.addedWeights}>
              <div className={styles.weightStack}>
                {weightsAdded.map((weight, index) => (
                  <button
                    key={index}
                    className={styles.weightButton}
                    onClick={() => removeWeight(index)}
                    title={`Click to remove ${weight}kg`}
                    style={{
                      width: `${weight * 5}px`,
                      backgroundColor: 'grey',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      marginBottom: '5px',
                    }}
                  >
                    {weight}
                  </button>
                ))}
              </div>
              <p>{`Current Total: ${currentWeight} kg`}</p>
            </div>
            <div className={styles.buttons}>
              {[20, 10, 5, 2, 1].map((weight, index) => (
                <button
                  key={index}
                  className={styles.weightButton}
                  onClick={() => addWeight(weight)}
                >
                  +{weight}kg
                </button>
              ))}
            </div>
          </div>
          {showOverlay && (
            <div className={styles.overlay}>
              <h3>Congratulations! You matched your weight!</h3>
              <button onClick={resetGame} className={styles.playAgainButton}>Play Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GamePageType1;
