import React from 'react';

interface MessageComponentProps {
  sender: 'user' | 'assistant';
  text: string;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ sender, text }) => {
  const isAI = sender === 'assistant';
  
  // Function to replace "### Question X." with "Question X." for any number X
  const cleanText = (text: string) => {
    return text.replace(/### Question (\d+)\./, 'Question $1.').trim();
  };

  return (
    <p className={`message ${isAI ? 'AI' : 'User'}`}>
      <span>{cleanText(text)}</span>
    </p>
  );
};

export default MessageComponent;
