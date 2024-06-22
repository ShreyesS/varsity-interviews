import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AiAssistantComponent = () => {
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#d9dcff',
        progressColor: '#4353ff',
        cursorColor: '#4353ff',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 200,
        barGap: 3,
      });

      // Load your audio file here
      waveSurferRef.current.load('../audio/Hi%20there%20this%20is%20you.mp3');

      waveSurferRef.current.on('ready', () => {
        console.log('Audio is ready to play');
      });

      waveSurferRef.current.on('error', (e) => {
        console.error('Error loading audio file:', e);
      });

      waveSurferRef.current.on('finish', () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, []);

  const handlePlayPause = async () => {
    if (waveSurferRef.current) {
      try {
        if (waveSurferRef.current.isPlaying()) {
          waveSurferRef.current.pause();
          setIsPlaying(false);
        } else {
          await waveSurferRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing/pausing audio:', error);
      }
    }
  };

  return (
    <div className="ai-assistant-component">
      <h2>AI Assistant</h2>
      <div className="ai-assistant-content">
        <p>How can I assist you today?</p>
        <div ref={waveformRef}></div>
        <button onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default AiAssistantComponent;
