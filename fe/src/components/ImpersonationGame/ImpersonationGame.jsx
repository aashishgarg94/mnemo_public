import React, { useState } from "react";
import axios from "axios";
import './ImpersonationGame.css';
import AudioGenerator from '../GameScene/AudioGenerator'
import AutoplayAudio from '../GameScene/AutoplayAudio'

const BASE_URL = 'http://127.0.0.1:8000';

const ImpersonationGame = () => {
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl ] = useState('');
  const [language, setLanguage] = useState('English')

  const characters = [
    { name: "Harry Potter", img: "Harry_Potter.png" },
    { name: "Willy Wonka", img: "willy_wonka.png" },
    { name: "Hermione Granger", img: "Hermione_Granger.png" },
    { name: "Ron Weasley", img: "Ron_Weasley.jpeg" },
    { name: "Albus Dumbledore", img: "Albus_Dumbledore.jpg" },
    { name: "Severus Snape", img: "Severus_Snape.jpg" },
    { name: "Rubeus Hagrid", img: "Rubeus_Hagrid.jpg" },
    // { name: "Draco Malfoy", img: "Draco_Malfoy.jpeg" },
   
  ];

  const languages = [
    "hindi", "english"
  ]

  const characterGender = {
    "Harry Potter": "vian",
    "Hermione Granger": "misha",
    "Ron Weasley": "vian",
    "Albus Dumbledore": "vian",
    "Severus Snape": "vian",
    "Willy Wonka": "vian"
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value); // Update the selected language
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedCharacter || !question) {
      alert("Please select a character and ask a question.");
      return;
    }
    setAudioUrl('')
    const userMessage = { sender: "user", message: question };
    setMessages((prev) => [...prev, userMessage]); // Add user's message to the chat

    setIsLoading(true);
    setQuestion(""); // Clear the input box

    try {
      const params = new URLSearchParams({
        character: selectedCharacter,
        question: question,
      }).toString();

      const apiUrl = `${BASE_URL}/ai_impersonate/respond?${params}`;
      const apiResponse = await axios.post(apiUrl, messages);

      const characterResponse = {
        sender: selectedCharacter,
        message: apiResponse.data || "Hmm, I can't think of anything to say!",
      };
      // setAudioUrl(await AudioGenerator(apiResponse.data, characterGender[selectedCharacter], language));
      setMessages((prev) => [...prev, characterResponse]); // Add character's response to the chat
    } catch (error) {
      console.error("Error interacting with character:", error);
      const errorMessage = {
        sender: selectedCharacter,
        message: "There was an error processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterSelection = (e) => {
    setSelectedCharacter(e);
    setMessages([]);
  }

  return (
    <div className="chatScene">
      <div className="chatHeader">
        <span>Welcome to Impersonation</span>
        <select
          className="languageDropdown"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Hindi">Telugu</option>
          <option value="Hindi">Kannada</option>
        </select>
      </div>

      <div className="characterSelection">
        {characters.map((character) => (
          <div
            key={character.name}
            className={`characterCard ${
              selectedCharacter === character.name ? "selected" : ""
            }`}
            onClick={() => handleCharacterSelection(character.name)}
          >
            <img src={character.img} alt={character.name} />
            <p className="characterName">{character.name}</p>
          </div>
        ))}
      </div>

      <div className="chatContainer">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatBubble ${msg.sender === "user" ? "user" : "character"}`}
          >
            {msg.sender !== "user" && (
                <div className="characterLabel">{msg.sender}</div>
            )}
            {msg.message}
            {/* <AutoplayAudio audioUrl={audioUrl} /> */}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="inputContainer">
        <input
          type="text"
          className="inputBox"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" className="sendButton" disabled={isLoading || !question}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ImpersonationGame;
