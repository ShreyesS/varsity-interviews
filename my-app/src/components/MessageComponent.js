import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

const MessageComponent = ({ sender, text }) => {
  const isAI = sender === 'AI';
  return (
    <p className={`message ${isAI ? 'AI' : 'User'}`}>
      <FontAwesomeIcon icon={isAI ? faRobot : faUser} className="message-icon" />
      <span>{text}</span>
    </p>
  );
};

export default MessageComponent;
