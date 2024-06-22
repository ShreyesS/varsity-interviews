import React from 'react';

const MessageComponent = ({ sender, text }) => {
  const isAI = sender === 'AI';
  return (
    <p className={`message ${isAI ? 'AI' : 'User'}`}>
      <strong>{sender}:</strong> {text}
    </p>
  );
};

export default MessageComponent;
