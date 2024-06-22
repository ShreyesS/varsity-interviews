import React, { useState, useEffect, useRef } from 'react';
import './TranscriptComponent.css';
import MessageComponent from './MessageComponent';

const initialChatData = [
  { sender: 'AI', text: "That's great to hear, Aaron!" },
  { sender: 'AI', text: 'It sounds like you have a solid background for this role.' },
  { sender: 'AI', text: "Let's dive into some questions." },
  { sender: 'AI', text: 'This position is in-person, so you would come into the London office.' },
  { sender: 'AI', text: 'Are you able to work in London?' },
  { sender: 'User', text: "I'm a dual citizen of the United States and the UK, so I don't think that'll be an issue for me." },
];

const TranscriptComponent = () => {
  const [chatData, setChatData] = useState(initialChatData);
  const transcriptContentRef = useRef(null);

  useEffect(() => {
    const scrollHeight = transcriptContentRef.current.scrollHeight;
    const height = transcriptContentRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    transcriptContentRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }, [chatData]);

  const addMessage = (sender) => {
    setChatData([...chatData, { sender, text: 'test' }]);
  };

  return (
    <div className="transcript-component">
      <h2>Live Transcript</h2>
      <div className="transcript-content" ref={transcriptContentRef}>
        {chatData.map((chat, index) => (
          <MessageComponent key={index} sender={chat.sender} text={chat.text} />
        ))}
      </div>
      <div className="buttons">
        <button onClick={() => addMessage('AI')}>Add AI Message</button>
        <button onClick={() => addMessage('User')}>Add User Message</button>
      </div>
    </div>
  );
};

export default TranscriptComponent;
