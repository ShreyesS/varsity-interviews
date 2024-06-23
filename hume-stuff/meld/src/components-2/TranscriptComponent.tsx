import React, { useState, useEffect, useRef } from 'react';
import './TranscriptComponent.css';
import MessageComponent from './MessageComponent';

interface TranscriptComponentProps {
  messages: { role: 'user' | 'assistant'; content: string }[];
}

const TranscriptComponent: React.FC<TranscriptComponentProps> = ({ messages }) => {
  const transcriptContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollHeight = transcriptContentRef.current?.scrollHeight || 0;
    const height = transcriptContentRef.current?.clientHeight || 0;
    const maxScrollTop = scrollHeight - height;
    if (transcriptContentRef.current) {
      transcriptContentRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [messages]);

  return (
    <div className="transcript-component">
      <h2>Live Transcript</h2>
      <div className="transcript-content" ref={transcriptContentRef}>
        {messages.map((msg, index) => (
          <MessageComponent key={index} sender={msg.role} text={msg.content} />
        ))}
      </div>
    </div>
  );
};

export default TranscriptComponent;