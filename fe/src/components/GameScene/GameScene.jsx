import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GameScene.module.css';

import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AudioGenerator from './AudioGenerator'
import AutoplayAudio from './AutoplayAudio'
const BASE_URL = 'http://127.0.0.1:8000';

const GameScene = ({}) => {
  const location = useLocation();
  const { character, companion, worldId, background_image } = location.state || {
    character: "/chatacter2.gif", companion: "/character2.gif", worldId: 1, background_image: "https://mnemo-assets.s3.ap-south-1.amazonaws.com/game_background_overview.jpeg" };
  const defaultGameState = {
    nextMessage: `Welcome to Egypt, the world of cleopatra}!`,
    step: 0,
    background_image: 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/game_background_overview.jpeg',
    avatar_images: [],
    prompt_suggestions: [],
  };
  const getPuzzleImage = (puzzleId) => {
    return `/${puzzleId}.png`;
  };
  const navigate = useNavigate();
  const [currentBackground, setCurrentBackground] = useState(defaultGameState.background_image);
  const [fadeState, setFadeState] = useState(false); // for fade in/out
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Initially true to show zoom-in effect
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState(defaultGameState);
  const [game_history, setGameHistory] = useState([]);
  const [characterPosition, setCharacterPosition] = useState({ x: 900, y: 470 });
  const [messageProgress, setMessageProgress] = useState('');
  const [assets, setAssets] = useState([]);

  const [audioUrl, setAudioUrl ] = useState('')
  const [gameMode, setGameMode] = useState('rpg'); // 'rpg' or 'puzzle'
  const [currentPuzzle, setCurrentPuzzle] = useState('hieroglyphic_01');
  const [companionPosition] = useState({ x: window.innerWidth - 450, y: window.innerHeight - 150 });
  const [isNewImageAvailable, setIsNewImageAvailable] = useState(false);
  const [isAssetFetchEnabled, setIsAssetFetchEnabled] = useState(false);
  const [companionMessage, setCompanionMessage] = useState('');

  // Update companion handler
  const handleCompanionClick = async () => {
    companionAudio.currentTime = 0;
    companionAudio.play();
    
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        user_message: 'companion_interact',
        player_id: 1,
        current_step: parseInt(gameState.step),
      }).toString();
  
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/ai_game/companion?${params}`,
        data: game_history,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("here",response.data[0])
      setCompanionMessage(response.data[0].nextMessage);
    } catch (err) {
      console.error('Failed to interact with companion:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  console.log("here5", assets)
  console.log("here2", companionMessage)
  // Add fetch assets function
  const fetchAsset = async (user_input) => {
    if (!isAssetFetchEnabled) return;
    
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        user_message: user_input,
        player_id: 1,
        current_step: parseInt(gameState.step)
      }).toString();
  
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/ai_game/assets?${params}`,
        data: game_history,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("abc",response.data[0])
  
      if (response.data[0]) {
        setAssets(prevAssets => [...prevAssets, response.data[0]]);
      }
      setGameHistory(response.data[1]);
    } catch (err) {
      console.error('Failed to fetch asset:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const [gameAudio] = useState(() => {
    const audio_game = new Audio('/game.mp3');
    audio_game.volume = 0.05;
    return audio_game;
});
  const [puzzleAudio] = useState(() => {
    const audio_challenge = new Audio('/challenge.mp3');
    audio_challenge.volume = 0.05;
    return audio_challenge;
});
  const [companionAudio] = useState(() => {
    const audio_character = new Audio('/cat.mp3');
    return audio_character;
});


  const [isMessageComplete, setIsMessageComplete] = useState(false);
  const toggleGameMode = (next_mode) => {
    const newMode = next_mode === 'puzzle' ? 'puzzle' : next_mode === 'exit' ? 'exit' : 'rpg';
    if(newMode === 'exit') {
      setMessageProgress('');
      setGameState(prevState => ({
        ...prevState,
        nextMessage: '',
    }));
    }
    setGameMode(newMode);
    fetchGameState('continue', newMode);
  };

  // Clip AI message if longer than 50 words

  const clipMessage = (message) => {
    console.log("3==========",message);
    console.log(gameState);
    const words = message.trim().split(/\s+/);
    if (words.length <= 100) return message;
    return words.slice(0, 50).join(' ') + '...';
  };

  // useEffect(() => {
  //   AudioPlayer("Hello ")
  // })

  useEffect(() => {
    let timeout;
    if (gameState.nextMessage) {
      setIsMessageComplete(false);
      setMessageProgress(''); // Clear previous progress
      // AudioPlayer(gameState.nextMessage)
      const characters = gameState.nextMessage.split(''); // Split message into characters
      let index = 0;
  
      const typeMessage = () => {
        if (index < characters.length) {
          setMessageProgress((prev) => prev + characters[index]);
          console.log(index, messageProgress);
          index++;
          timeout = setTimeout(typeMessage, 50); // Adjust typing speed as needed
        }
        else {
          setMessageProgress(gameState.nextMessage); // Show full message when typing is done
          setIsMessageComplete(true);
        }
      };
  
      typeMessage(); // Start typing effect
    }
  
    return () => clearTimeout(timeout); // Cleanup timeout on unmount or message change
  }, [gameState.nextMessage]);
  
  
  useEffect(() => {
    gameAudio.loop = true;
    gameAudio.play();
    return () => {
      gameAudio.pause();
      gameAudio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const currentAudio = gameMode === 'rpg' ? gameAudio : puzzleAudio;
    currentAudio.loop = true;
    currentAudio.play();
    
    // Stop other audio
    const otherAudio = gameMode === 'rpg' ? puzzleAudio : gameAudio;
    otherAudio.pause();
    otherAudio.currentTime = 0;
  
    return () => {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    };
  }, [gameMode]);
  // Zoom-in and fade transition on initial load
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 3000); // Simulate loading time
    return () => clearTimeout(timeout);
  }, []);

  // Handle background fade transition
  useEffect(() => {
    if (gameState.background_image && gameState.background_image !== currentBackground) {
      setFadeState(true); // Start fading out the current background
      const timeout = setTimeout(() => {
        setCurrentBackground(gameState.background_image); // Update to the new background
        setFadeState(false); // Fade in the new background
      }, 500); // Match CSS transition duration
  
      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [gameState.background_image, currentBackground]);
  
  useEffect(() => {
    fetchGameState('start');
  }, []);

  const fetchGameState = async (userInput = '', mode = gameMode) => {
    try {

      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({
        user_message: userInput,
        player_id: 1,  // Integer
        current_step: parseInt(gameState.step),  // Convert to integer
        background_image: gameState.background_image,
        ...(mode === 'puzzle' && { puzzle: currentPuzzle }),
      }).toString();
      const endpoint = mode === 'rpg' ? '/respond' : mode === 'puzzle' ? '/puzzle' : '/summarize';
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/ai_game${endpoint}?${params}`,
        data: game_history,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let nextMessage = response.data[0].nextMessage;
      if(nextMessage.startsWith('Cleopatra')) {
        nextMessage = nextMessage.replace('Cleopatra:', '');
      }
      setAudioUrl(await AudioGenerator(nextMessage))
      console.log("nextMessage",nextMessage);
      setGameState(prevState => {
        const newBackground = response.data[0].background_image;
        if (newBackground && newBackground !== prevState.background_image) {
          setIsNewImageAvailable(true);
        }
        return {
        ...prevState,
        nextMessage: clipMessage(nextMessage) || prevState.nextMessage,
        step: parseInt(response.data[0].step) || prevState.step,
        background_image: newBackground || prevState.background_image,
        avatar_images: response.data[0].avatar_images || prevState.avatar_images,
        prompt_suggestions: response.data[0].prompt_suggestions || [],
      };
    });
      console.log("2==========",gameState);

      setGameHistory(response.data[1])
    } catch (err) {
      setError('Failed to fetch game state');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle character movement with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = 20; // Movement step size
        const containerRect = document.querySelector(`.${styles.gameScene}`).getBoundingClientRect();
      setCharacterPosition((prev) => {
        switch (e.key) {
          case 'ArrowUp':
            return { ...prev, y: Math.max(0, prev.y - step) };
          case 'ArrowDown':
            return { ...prev, y: Math.min(window.innerHeight - 100, prev.y + step) };
          case 'ArrowLeft':
            return { ...prev, x: Math.max(0, prev.x - step) };
          case 'ArrowRight':
            return { ...prev, x: Math.min(window.innerWidth - 100, prev.x + step) };
          default:
            return prev;
        }
      });
    }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    fetchGameState(inputValue);
    setInputValue('');
  };

  const handlePromptClick = (prompt) => {
    fetchGameState(prompt);
  };

  const handleNextExit = (action) => {
    if (action === 'next') {
      fetchGameState('next');
    } else if (action === 'exit') {
      fetchGameState('exit');
    }
  };


  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      isAssetFetchEnabled ? fetchAsset(inputValue) : fetchGameState(inputValue);  
      setInputValue('');
    }
  };

  // const handleCompanionClick = async () => {
  //   companionAudio.currentTime = 0;
  //   companionAudio.play();
  //   try {
  //     setIsLoading(true);
  //     const params = new URLSearchParams({
  //       user_message: 'companion_interact',
  //       player_id: 1,
  //       current_step: parseInt(gameState.step),
  //     }).toString();

  //     const response = await axios({
  //       method: 'post',
  //       url: `${BASE_URL}/ai_game/companion?${params}`,
  //       data: game_history,
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     setGameState(prevState => ({
  //       ...prevState,
  //       nextMessage: clipMessage(response.data[0].nextMessage),
  //       step: parseInt(response.data[0].step),
  //     }));
  //   } catch (err) {
  //     setError('Failed to interact with companion');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  useEffect(() => {
    return () => {
      gameAudio.pause();
      puzzleAudio.pause();
      companionAudio.pause();
    };
  }, []);

  return (
    <div className={styles.gameScene}>
      {/* {isLoading && (
        <div className={styles.loadingBackground} style={{ backgroundImage: `url(${currentBackground})` }} />
      )} */}
      {/* Home button at top-left */}
      <div className={styles.controlButtons}>
      <div className={styles.controlButtons}>
  {/* ...existing buttons... */}
  <button
    className={`${styles.assetButton} ${isAssetFetchEnabled ? styles.enabled : ''}`}
    onClick={() => setIsAssetFetchEnabled(!isAssetFetchEnabled)}
  >
    {isAssetFetchEnabled ? 'Disable Assets' : 'Enable Assets'}
  </button>
</div>

      <button
        className={styles.homeButton}
        onClick={() => navigate('/')}
      >
        Home
      </button>
      <button 
          className={`${styles.modeButton} ${styles[gameMode]}`}
          onClick={() => toggleGameMode(gameMode === 'rpg' ? 'puzzle' : 'rpg')}
        >
          {gameMode === 'rpg' ? 'Switch to Puzzle' : 'Switch to RPG'}
        </button>
        </div>
      {/* Background Container with fade transition */}
      {/* <div
        className={`${styles.background} ${fadeState ? styles.fadeOut : styles.fadeIn}`}
        style={{ backgroundImage: `url(${currentBackground})` }}
      ></div> */}
<div className={styles.backgroundLayers}>
  {/* Current background layer */}
  <div 
    className={styles.backgroundLayer}
    style={{ 
      backgroundImage: `url(${currentBackground})`,
      opacity: fadeState ? 0 : 1, // Fade out when fadeState is true
      zIndex: fadeState ? 1 : 2, // Ensure proper stacking during transition
      transition: 'opacity 0.5s ease-in-out', // Smooth transition
    }}
  />
  {/* New background layer */}
  <div 
    className={styles.backgroundLayer}
    style={{ 
      backgroundImage: `url(${gameState.background_image})`,
      opacity: fadeState ? 1 : 0, // Fade in when fadeState is true
      zIndex: fadeState ? 2 : 1, // Ensure proper stacking during transition
      transition: 'opacity 0.5s ease-in-out', // Smooth transition
    }}
  />
</div>
      {/* Character */}
      {gameMode === 'exit' && (
      <div className={styles.exitOverlay}>
        <div className={styles.exitMessage}>
          {messageProgress}
          {isMessageComplete && gameState.prompt_suggestions && (
            <div className={styles.promptsContainer}>
              {gameState.prompt_suggestions.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className={styles.promptButton}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
      {gameMode === 'puzzle' && (
      <div className={styles.puzzleOverlay}>
        <img 
          src={getPuzzleImage(currentPuzzle)} 
          alt="Puzzle"
          className={styles.puzzleImage}
        />
      </div>
    )}
      <div
        className={styles.character}
        style={{
          left: characterPosition.x,
          top: characterPosition.y,
          backgroundImage: `url(${character})`,
        }}
      ></div>
      {/* Add companion */}
      <div 
        className={styles.companion}
        style={{
          position: 'absolute',
          left: `${companionPosition.x}px`,
          top: `${companionPosition.y}px`,
          cursor: 'pointer'
        }}
        onClick={handleCompanionClick}
      >
        <img 
          src={companion} 
          alt="Companion"
          style={{ width: '100px', height: '100px' }}
        />
      </div>
      <div className={styles.assetsContainer}>
    {assets.map((asset, index) => (
      <img
        key={index}
        src={asset.src}
        alt={`Asset ${index}`}
        className={styles.asset}
        style={{
          position: 'absolute',
          left: `${asset.x}px`,
          top: `${asset.y}px`,
          maxWidth: '100px',
          maxHeight: '100px'
        }}
      />
    ))}
  </div>
  
      {/* Avatars on Screen */}
      <div className={styles.avatarsContainer}>
        {gameState.avatar_images.map((avatar, idx) => {
          const isSpeaker = idx === 0; // First avatar is the speaker
          
          return (
            <div>
                <div
                  key={idx}
                  className={styles.avatarWrapper}
                  style={{
                    left: avatar.x,
                    top: avatar.y
                  }}
                >
                <img src={avatar.src} alt={`Avatar ${idx}`} className={styles.avatar} />
                {/* Speech Bubble for the speaking avatar */}
                {isSpeaker && gameMode !== 'exit' && (
                  <div className={styles.speechBubble}>
                    {messageProgress}
                    {isLoading && (
                      <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {audioUrl && (
                  <AutoplayAudio audioUrl={audioUrl} />)}
            </div>
          );
        })}
      </div>

      {/* Suggested Prompts on the right side */}
      <div className={styles.promptsContainer}>
        {isMessageComplete && gameState.prompt_suggestions && gameState.prompt_suggestions.map((prompt, index) => (
          <div 
            key={index}
            className={styles.promptItem}
            onClick={() => handlePromptClick(prompt)}
          >
            {prompt}
          </div>
        ))}
      </div>

      {/* Bottom Bar with Input and Next/Exit buttons */}
      <div className={styles.bottomBar}>
        <input
          type="text"
          value={inputValue}
          placeholder="Type your response..."
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          className={styles.inputBox}
        />
        <button 
          className={styles.sendButton}
          onClick={handleInputSubmit}
        >
          Send
        </button>

        <button 
          className={styles.nextButton}
          onClick={() => handleNextExit('next')}
        >
          Next
        </button>
        <button 
          className={styles.exitButton}
          onClick={() => toggleGameMode('exit')}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default GameScene;
