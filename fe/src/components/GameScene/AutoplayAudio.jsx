import React, { useEffect, useRef } from "react";
import styles from './GameScene.module.css';

const AutoplayAudio = ({ audioUrl }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.preload = "auto";
    audioRef.current = audio;

    audio.play().catch(() => {
      console.log("Autoplay blocked. Waiting for user interaction.");
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ""; // Cleanup
      }
    };
  }, [audioUrl]);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      console.log("click happened")
      audioRef.current.play()
        .then(() => console.log("Audio is playing."))
        .catch((error) => console.error("Playback failed:", error));
    }
  };

  return (
    <div className={styles.audio}> 
      <button onClick={handlePlayAudio}>Play Audio</button>
    </div>
  );
};

export default AutoplayAudio;