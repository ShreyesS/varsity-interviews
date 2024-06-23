import React from 'react';

interface MessageComponentProps {
  sender: 'user' | 'assistant';
  text: string;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ sender, text }) => {
  const isAI = sender === 'assistant';
  
  // Function to remove the specified characters
  const cleanText = (text: string) => {
    return text.replace("### Question 3.", "").trim();
  };

  return (
    <p className={`message ${isAI ? 'AI' : 'User'}`}>
      <span>{cleanText(text)}</span>
    </p>
  );
};

export default MessageComponent;
