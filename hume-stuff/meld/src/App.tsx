import { fetchAccessToken } from '@humeai/voice';
import { VoiceProvider } from '@humeai/voice-react';
import { useEffect, useState } from 'react';
import ChatStage from '@components/ChatStage';
import VideoComponent from './components-2/VideoComponent';
import TranscriptComponent from './components-2/TranscriptComponent';
import ExpandableComponent from './components-2/ExpandableComponent';
import './App.css';
import LiveAudioWaveform from './components-2/WaveformComponent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Score {
  [emotion: string]: number;
}

function App() {
  const [accessToken, setAccessToken] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userScores, setUserScores] = useState<Score[]>([]);
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const apiKey = import.meta.env.VITE_HUME_API_KEY || '';
      const secretKey = import.meta.env.VITE_HUME_SECRET_KEY || '';

      const token = (await fetchAccessToken({ apiKey, secretKey })) || '';

      setAccessToken(token);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (isExpanded) {
      setIsFading(true);
      setTimeout(() => {
        setIsFading(false);
        setIsHidden(true);
      }, 1000);
    } else {
      setIsHidden(false);
    }
  }, [isExpanded]);

  const sendToOpenAI = async () => {
    const prompt = generatePrompt(messages);
    console.log('Sending prompt to OpenAI:', prompt);

    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Ensure the API key is correct
        },
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: prompt,
          max_tokens: 50,
        }),
      });

      if (response.ok) {
        console.log('Prompt successfully sent to OpenAI');
        const data = await response.json();
        console.log('OpenAI response:', data);
        return data;
      } else {
        console.error('Error sending prompt to OpenAI:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const generatePrompt = (messages: Message[]) => {
    return "What is 10+10?";
  };

  const handleMessage = async (message: any) => {
    console.log('Received message:', message); // Log the entire message for debugging
    switch (message.type) {
      case 'user_message':
      case 'assistant_message':
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: message.message.role, content: message.message.content },
        ]);
        console.log(`${message.message.role}: `, message.message.content);
        
        // Save scores for user responses
        if (message.message.role === 'user') {
          if (message.models && message.models.prosody && message.models.prosody.scores) {
            setUserScores((prevScores) => [
              ...prevScores,
              message.models.prosody.scores
            ]);
          }
        }
        break;
      case 'audio_output':
        // Log the audio output message
        console.log('Audio output message:', message);
        
        // Decode the base64 audio data and create an audio URL
        const audioBlob = base64ToBlob(message.data, 'audio/wav');
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Audio URL: ', audioUrl);
        break;
      default:
        console.log('Unknown message type:', message.type); // Log unknown message types for debugging
        break;
    }
  };

  const base64ToBlob = (base64: string, mime: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  };

  return (
    <VoiceProvider
      auth={{ type: 'accessToken', value: accessToken }}
      configId={'d1955c72-4f15-4ac2-b98a-5232dec4180c'}
      onMessage={handleMessage}
    >
      <div className={`container ${isFading ? 'fade-out' : 'fade-in'} ${isHidden ? 'hidden' : ''}`}>
        <div className="left">
          <div className="video-container">
            <VideoComponent />
          </div>
          <div className='waveform'>
            <LiveAudioWaveform/>
          </div>
          <div className="chat-stage">
            <ChatStage setIsExpanded={setIsExpanded} />
          </div>
        </div>
        <div className="right">
          <TranscriptComponent messages={messages} />
        </div>
        <div>
          <h3>User Scores</h3>
          <pre>{JSON.stringify(userScores, null, 2)}</pre>
        </div>
      </div>
      <ExpandableComponent isExpanded={isExpanded && !isFading} />
    </VoiceProvider>
  );
}

export default App;
