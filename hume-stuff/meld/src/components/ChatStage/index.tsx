import Avatars from '@components/Avatars';
import { useVoice } from '@humeai/voice-react';
import { AvatarProvider } from '@store/AvatarProvider';
import React from 'react';
import { match } from 'ts-pattern';
import './ChatStage.css'; // Import the CSS file

/**
 * Main view for displaying the avatars and conversation
 */
const ChatStage: React.FC = () => {
  const { connect, disconnect, status } = useVoice();

  const handleConnect = () => {
    if (status.value === 'connected') {
      disconnect();
      return;
    }
    void connect()
      .then(() => {})
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="font-nationalPark absolute inset-0 size-full bg-blue-50 flex flex-col justify-center items-center">
      <div>
        {match(status.value)
          .with('error', () => {
            return (
              <div>
                <p>Something went wrong</p>
                <button onClick={() => handleConnect()}>Try again</button>
              </div>
            );
          })
          .with('disconnected', 'connecting', () => {
            return <div></div>;
          })
          .with('connected', () => {
            return (
              <div></div>
            );
          })
          .exhaustive()}
      </div>
      <button
        onClick={() => handleConnect()}
        className="chat-button"
      >
        {status.value === 'connected' ? 'End chat' : 'Start chat!'}
      </button>
    </div>
  );
};

export default ChatStage;
