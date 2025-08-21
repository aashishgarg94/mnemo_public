# Mnemo: Generative Open-World RPG for Learning

Mnemo is a learning platform that turns lessons into adventures.  
Instead of passive screen-time, children step into **open-world role-playing games** where their actions drive the story. Parents can provide a PDF or a simple prompt and Mnemo’s **AI playmates** convert it into an interactive quest filled with puzzles, narration, and feedback. Behind the scenes a network of AI agents ensures challenges adapt to the child’s pace, skills, and interests.

---

## ✨ Key Features

- **Generative Open-World RPGs**  
  Lessons become immersive environments (e.g., Ancient Egypt, Amazon rainforest, Mars) with quests, puzzles, and time-travel missions.

- **AI Playmates**  
  Characters like Robin Hood, Merlin, or custom heroes accompany the learner, powered by multi-agent backends (Game Creation Agent, Subject Matter Expert, SEL Agents, etc.).

- **Adaptive Learning**  
  No fixed levels—Mnemo dynamically adapts to learning pace, style, and peer interactions. Challenges are non-repetitive and growth-driven.

- **Impersonation & RAG**  
  Kids can ask “Cleopatra” or other historical figures questions. An impersonation engine retrieves knowledge snippets and answers in character.

- **Parental Control & Customization**  
  Parents upload content (e.g., `fractions.pdf`) or type prompts (“Robin Hood with his bow and arrow”) to create personalized challenges.

- **Skill Development**  
  Combines numeracy, problem-solving, SEL (social-emotional learning), and teamwork in a playful format.

---

## 🏗️ Architecture

### Backend
- **FastAPI** server (`backend/src/main.py`) with modular routers for:
  - `ai_game`: scenario-based adventures and puzzle flow  
  - `ai_impersonate`: retrieval-augmented impersonation system  
  - `master`: healthcheck, app info, root routes
- **Agents Framework** (`backend/src/ai/agents.py`) including:
  - `PuzzleAgent`, `SummaryAgent`, `CompanionAgent`, `EvaluatorAgent`
  - Word2Vec/GloVe embeddings for semantic similarity
- **Models**: LLaMA wrapper (`backend/src/models/llama.py`) for reasoning and dialogue

### Frontend
- **React (Vite)** app (`fe/`) with routes for:
  - **Onboarding & Parent Dashboard**  
  - **Game Scene**: real-time interaction with AI agents  
  - **ImpersonationGame**: chat with historical/fictional characters  
- Built with modular components (`Game.jsx`, `GameScene.jsx`, `ImpersonationGame.jsx`)  
- Integration with backend via REST endpoints

---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (optional, for containerized deployment)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
make run   # runs uvicorn main:app
