import { fetchAccessToken } from '@humeai/voice';
import { VoiceProvider } from '@humeai/voice-react';
import { useEffect, useState } from 'react';
import ChatStage from '@components/ChatStage';
import VideoComponent from './components-2/VideoComponent';
import TranscriptComponent from './components-2/TranscriptComponent';
import ExpandableComponent from './components-2/ExpandableComponent';
import './App.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [accessToken, setAccessToken] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <VoiceProvider
      auth={{ type: 'accessToken', value: accessToken }}
      configId={'d1955c72-4f15-4ac2-b98a-5232dec4180c'}
      onMessage={handleMessage}
    >
      <div className="container">
        <div className="left">
          <div className="video-container">
            <VideoComponent />
          </div>
          <div className="chat-stage">
            <ChatStage setIsExpanded={setIsExpanded} />
          </div>
        </div>
        <div className="right">
          <TranscriptComponent messages={messages} />
        </div>
      </div>
      <ExpandableComponent isExpanded={isExpanded} />
    </VoiceProvider>
  );
}

export default App;
