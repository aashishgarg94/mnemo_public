import React, { useEffect, useRef } from 'react';
import styles from './Community.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faStar, faComments } from '@fortawesome/free-regular-svg-icons';

const Community = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const numParticles = 50;
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

    // Animation loop
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

    // Setup
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className={styles.community}>
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      <div className={styles.content}>
        <h2>A Meaningful Community Experience</h2>
        <p className={styles.subheading}>
          Safe online play with friends and guided interactions
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}><FontAwesomeIcon icon={faAddressCard} style={{ color: '#FF7EB3' }}/></div>
            <h3>Mini Leagues</h3>
            <p>Peer & School mini leagues for friendly competition and collaboration</p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}><FontAwesomeIcon icon={faStar} style={{ color: '#FF7EB3' }}/></div>
            <h3>Shareable rewards</h3>
            <p>Earn outcome based rewards to share with family and friends</p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}><FontAwesomeIcon icon={faComments} style={{ color: '#FF7EB3' }}/></div>
            <h3>Parent community</h3>
            <p>Connect for insights, tips and support in your child's journey</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
