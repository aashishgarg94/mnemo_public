import React from 'react';
import styles from './ImageGallery.module.css'; // Using the same styles as Hero

const ImageGallery = () => {
  const images = [
    '/exp1.png',
    '/exp2.png',
    '/exp3.png',
    '/exp4.png'
  ];

  return (
    <section className={styles.gallery}>
      <h2 className={styles.heroTitle}>Experiential Learning Modules</h2>
      <p className={styles.heroDescription}>
        To foster better learning
      </p>
      <div className={styles.galleryContainer}>
        {images.map((image, index) => (
          <div className={styles.galleryItem} key={index}>
            <img
              src={image}
              alt={`Gallery Image ${index + 1}`}
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery;