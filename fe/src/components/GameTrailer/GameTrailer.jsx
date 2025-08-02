import React, { useRef } from 'react';
import './GameTrailer.css';

const GameTrailer = () => {
  const videoRef = useRef(null);

  const handlePlay = () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      // Request fullscreen mode
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      }

      // Lock orientation to landscape (if supported)
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch((err) => {
          console.warn('Orientation lock not supported:', err);
        });
      }
    }
  };

  const trailerUrl = 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/game_video.mp4';

  return (
    <section className="game-trailer" id="gametrailer">
      <div className="container">
        <h2>Game Teaser</h2>
        <div className="video-container">
          <video
            controls
            className="gameplay-video"
            poster="/video_cover2.png"
            ref={videoRef}
            onPlay={handlePlay}
          >
            <source src={trailerUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default GameTrailer;
