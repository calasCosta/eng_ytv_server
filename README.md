# Project Objectives and Contributions (2022 Version)

The developed project aims to create a full-stack web application whose main objective is to provide a platform for studying the English language through YouTube videos. The application will allow users to:

## Core Features
- **View video transcript** during video playback
- **Click on a word** to see its meaning and definition
- **Add words/expressions** with their meanings and optional user-written notes, categorising them into one of three recognition levels:
  - "Known"
  - "Almost Known"
  - "Unknown"
- **Move words/expressions** between different recognition levels
- **Create video playlists** for organized study sessions
- **Play flashcards** with previously added words/expressions
  - Flashcards are cards used to allow users to self-assess their knowledge of previously added expressions/words. Each flashcard contains a word on the front and its meaning on the back.
  - They are used in a quiz format, where users try to guess the meanings of expressions presented to them (i.e., recall what's on the back of the flashcard based on the shown expression) and subsequently self-assess by choosing the appropriate recognition level for each word/expression.
- **View "Word of the Day"** presented every 24 hours
- **Interact with other system users** through a chat feature that enables communication between connected users

## Educational Value
This application combines multimedia content consumption with active vocabulary building and social learning, creating an immersive English language learning experience through authentic video content and interactive study tools.

## Technology Stack

### Frontend
- **React.js** - Frontend development framework for building user interfaces

### Backend
- **Node.js/Express.js** - Server creation and management using RESTful API methodology

### Database
- **MySQL** - Relational database for data persistence

### APIs & External Services
- **YouTube API** - Consuming YouTube video data and metadata
- **Merriam-Webster API** - Accessing dictionary definitions and word meanings
- **Deepgram API** - Speech-to-text service for obtaining video transcripts
- **React Google Login** - OAuth integration for user registration and authentication

### Architecture
- **RESTful API** - Communication between frontend and backend
- **Client-Server Model** - Traditional web application architecture
