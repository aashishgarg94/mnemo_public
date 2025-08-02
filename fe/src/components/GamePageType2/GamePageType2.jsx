import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './GamePageType2.module.css';
import { FaArrowLeft } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';

function GamePageType2() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [userClue, setUserClue] = useState('');
  const [humanMessage, setHumanMessage] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [clueMessage, setClueMessage] = useState('');
  const [aiGuesses, setAiGuesses] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState({});
  const BASE_URL = 'http://127.0.0.1:8000';
  const [currentRound, setCurrentRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [currenRoundScore, setCurrentRoundScore] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showRulesOverlay, setShowRulesOverlay] = useState(true);
  
  const MAX_ROUNDS = 2;
  const fetchGameData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/game/start`);
      console.log(response.data);
      const sharedWordCards = response.data.shared_words.map(word => ({ word }));
      setCards(sharedWordCards);
      setGameId(response.data.game_id);
      setGameType(response.data.game_type);
      setAiMessage(response.data.instructions);
      setCorrectWords(response.data.user_words || []);
      const clueMessage = `Words to connect: ${response.data.user_words.join(', ')}`;
      setClueMessage(clueMessage);
      console.log('Clue Message:', clueMessage);
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchGameData();
  }, []);

  const sendClue = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedClue = userClue.trim();
    if (!trimmedClue) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/game/clue?game_type=${gameType}&game_id=${gameId}`, {
        word: trimmedClue
      });
      console.log(response.data);

      setHumanMessage(trimmedClue);
      
      const guessesMessage = response.data.guesses 
        ? `My guesses: ${response.data.guesses.join(', ')}` 
        : response.data.aiGuess || '';
      setAiMessage(guessesMessage);
      
      const currentGuesses = response.data.guesses || [];
      setAiGuesses(currentGuesses);
      
      const incorrectGuessedWords = currentGuesses.filter(
        guess => !correctWords.includes(guess)
      );
      setIncorrectGuesses(incorrectGuessedWords);

      // Flip cards one by one
      currentGuesses.forEach((guess, index) => {
        setTimeout(() => {
          setIsFlipped(prev => ({
            ...prev,
            [guess]: true
          }));
        }, index * 500); // 500ms delay between each card flip
      });

      // Show game result after all cards have flipped
      setTimeout(() => {
        if (currentRound === MAX_ROUNDS) {
          setGameResult('final');
        } else {
          setGameResult(true);
        }
      }, (currentGuesses.length * 500) + 500); // Wait for all cards to flip plus a small delay

      setUserClue('');
    } catch (error) {
      console.error("Error sending clue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendClue(e);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  const handleRoundComplete = () => {
    const roundScore = aiGuesses.filter(guess => correctWords.includes(guess)).length;
    setRoundScores(prev => [...prev, roundScore]);
    setCurrentRoundScore(roundScore);
    setTotalScore(prev => prev + roundScore);
  
    if (currentRound < MAX_ROUNDS) {
      // Reset states for next round
      setCurrentRound(prev => prev + 1);
      setAiGuesses([]);
      setIsFlipped({});
      setUserClue('');
      setHumanMessage('');
      setAiMessage('');
      setGameResult(null);
      fetchGameData();
    } else {
      // End game after 5 rounds
      setGameResult('final');
      setShowOverlay(true);
    }
  };

  return (
    <div className={styles.gamePage}>
      {showRulesOverlay && (
        <div className={styles.overlay}>
          <h2>Game Rules</h2>
          <p>You will be given a set of words to connect. You need to provide a clue that connects the words. The AI will guess the words based on your clue.</p>
          <p>If the AI guesses correctly, the word will be marked with a tick. If the AI guesses incorrectly, the word will be marked with a cross.</p>
          <p>You will be scored based on the number of correct guesses. You will play {MAX_ROUNDS} rounds.</p>
          <button className={styles.button} onClick={() => setShowRulesOverlay(false)}>
            Start Game
          </button>
        </div>
      )}
          {showOverlay && (
              <div className={styles.overlay}>
              <h2>Game Complete!</h2>
              <div>
                <p>Total Score: {totalScore}</p>
                {roundScores.map((score, index) => (
                  <p key={index}>Round {index + 1}: {score} points</p>
                ))}
              </div>
              <button className={styles.button} onClick={() => window.location.reload()}>
                Play Again
              </button>
              <button className={styles.button} onClick={goToHome}>
              Main Menu
            </button>
            </div>
          )}

      <button className={styles.backButton} onClick={goToHome}>
        <FaArrowLeft /> Back to Home
      </button>

      <div className={styles.gameContainer}>
        <div className={styles.characterContainer}>
          {/* <div className={styles.characterWrapper}>
            <img src="/boy.png" alt="Human" className={styles.characterImage} />
            <div className={`${styles.speechBubble} ${humanMessage ? styles.visible : ''}`}>
              {humanMessage}
            </div>
          </div> */}
          <div className={styles.characterWrapper}>
            <div className={`${clueMessage ? styles.visible : ''}`}>
              Round: {currentRound} / {MAX_ROUNDS}
            </div>
            <div className={`${clueMessage ? styles.visible : ''}`}>
              {clueMessage}
            </div>
            <img src="/ai.png" alt="AI" className={styles.characterImage} />
            <div className={`${styles.speechBubble} ${aiMessage ? styles.visible : ''}`}>
              {aiMessage}
            </div>
          </div>
        </div>

        <div className={styles.cardContainer}>
          {cards.map((card, index) => (
            <div 
              key={index}
              className={`${styles.card} ${
                isFlipped[card.word] ? styles.flipped : ''
              } ${
                aiGuesses.includes(card.word) && correctWords.includes(card.word)
                  ? styles.correct
                  : incorrectGuesses.includes(card.word)
                  ? styles.incorrect
                  : ''
              }`}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <span className={styles.cardText}>{card.word}</span>
                </div>
                <div className={styles.cardBack}>
                  <div className={styles.cardBackContent}>
                    <span className={styles.cardSymbol}>
                      {correctWords.includes(card.word) ? '✓' : '✗'}
                    </span>
                    <span className={styles.cardText}>{card.word}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!gameResult && !aiGuesses.length && (
          <form className={styles.inputContainer} onSubmit={sendClue}>
            <input 
              type="text" 
              value={userClue}
              onChange={(e) => setUserClue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your clue here..."
              className={styles.input}
              disabled={isLoading}
            />
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <BiLoaderAlt className={styles.spinner} /> : 'Submit'}
            </button>
          </form>
        )}

        {/* {(gameResult || aiGuesses.length > 0) && (
          <div className={styles.gameResultContainer}>
            <button className={styles.button} onClick={() => window.location.reload()}>
              Play Again
            </button>
            <button className={styles.button} onClick={goToHome}>
              Main Menu
            </button>
          </div>
        )} */}

            <div className={`${clueMessage ? styles.visible : ''}`}>
              Total Score till now: {totalScore}
            </div>
        {gameResult && (
          <div className={styles.gameResultContainer}>
              <button className={styles.button} onClick={handleRoundComplete}>
                Next
              </button>
            <button className={styles.button} onClick={goToHome}>
              Main Menu
            </button>
          </div>
        )}

        {isLoading && (
          <div className={styles.loaderOverlay}>
            <BiLoaderAlt className={styles.spinner} />
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePageType2;