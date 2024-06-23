import { fetchAccessToken } from '@humeai/voice';
import { VoiceProvider } from '@humeai/voice-react';
import { useEffect, useState } from 'react';
import ChatStage from '@components/ChatStage';
import VideoComponent from './components-2/VideoComponent';
import TranscriptComponent from './components-2/TranscriptComponent';
import './App.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Assuming there's a function to analyze sentiment from the Hume SDK

function App() {
  const [accessToken, setAccessToken] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatEnded, setChatEnded] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      const apiKey = import.meta.env.VITE_HUME_API_KEY || '';
      const secretKey = import.meta.env.VITE_HUME_SECRET_KEY || '';

      const token = (await fetchAccessToken({ apiKey, secretKey })) || '';

      setAccessToken(token);
    };

    fetchToken();
  }, []);

  const handleMessage = async (message: any) => {
    switch (message.type) {
      case 'user_message':
      case 'assistant_message':
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: message.message.role, content: message.message.content },
        ]);
        console.log(`${message.message.role}: `, message.message.content);
        break;
      default:
        break;
    }
  };

  const handleEndChat = () => {
    setMessages([]);
    setChatEnded(true);
  };

  return (
    <VoiceProvider
      auth={{ type: 'accessToken', value: accessToken }}
      configId={'d1955c72-4f15-4ac2-b98a-5232dec4180c'}
      onMessage={handleMessage}
    >
      <div className={`container ${chatEnded ? 'full-screen' : ''}`}>
        <div className={`left ${chatEnded ? 'fade-out' : ''}`}>
          <div className="video-container">
            <VideoComponent />
          </div>
          <div className="chat-stage">
            <ChatStage onEndChat={handleEndChat} />
          </div>
        </div>
        <div className={`right ${chatEnded ? 'expanded' : ''}`}>
          <TranscriptComponent messages={messages} />
        </div>
      </div>
    </VoiceProvider>
  );
}

export default App;
