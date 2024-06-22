import React from 'react';
import './App.css';
import VideoComponent from './components/VideoComponent';
import TranscriptComponent from './components/TranscriptComponent';
import AiAssistantComponent from './components/AiAssistantComponent';

const App = () => {
  return (
    <div className="app-container">
      <div className="video-container">
        <VideoComponent />
      </div>
      <div className="transcript-container">
        <TranscriptComponent />
      </div>
      <div className="ai-assistant-container">
        <AiAssistantComponent />
      </div>
    </div>
  );
};

export default App;
