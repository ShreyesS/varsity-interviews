import React from 'react';

interface MessageComponentProps {
  sender: 'user' | 'assistant';
  text: string;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ sender, text }) => {
  const isAI = sender === 'assistant';
  
  // Function to remove the specified characters

  return (
    <p className={`message ${isAI ? 'AI' : 'User'}`}>
      <span>{text}</span>
    </p>
  );
};

export default MessageComponent;
