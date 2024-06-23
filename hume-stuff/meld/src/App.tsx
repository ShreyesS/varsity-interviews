import { fetchAccessToken } from '@humeai/voice';
import { VoiceProvider } from '@humeai/voice-react';
import { useEffect, useState } from 'react';
import ChatStage from '@components/ChatStage';
import VideoComponent from './components-2/VideoComponent';
import TranscriptComponent from './components-2/TranscriptComponent';
import ExpandableComponent from './components-2/ExpandableComponent';
import OpenAI from './components-2/OpenAI'; // Ensure this is the correct path
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
  const [openAIResult, setOpenAIResult] = useState<string>('');
  const [topEmotions, setTopEmotions] = useState<{ emotion: string, score: number }[]>([]);

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

  const downloadJsonFile = () => {
    const jsonString = JSON.stringify(userScores, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_scores.json';
    link.click();
    URL.revokeObjectURL(url);

    // Call the OpenAI component function here
    sendToOpenAI(jsonString);
  };

  const sendToOpenAI = async (jsonString: string) => {
    const prompt = generatePrompt(jsonString);
    console.log('Sending prompt to OpenAI:', prompt);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Ensure the API key is correct
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 50,
        }),
      });

      if (response.ok) {
        console.log('Prompt successfully sent to OpenAI');
        const data = await response.json();
        console.log('OpenAI response:', data);
        setOpenAIResult(JSON.stringify(data, null, 2)); // Set the result state with the API response
      } else {
        console.error('Error sending prompt to OpenAI:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        setOpenAIResult('Error fetching data from OpenAI');
      }
    } catch (error) {
      console.error('Network error:', error);
      setOpenAIResult('Network error');
    }
  };

  const generatePrompt = (jsonString: string): string => {
    return `I have entered a list of key-value pairs in a JSON format. Each key has a value of a decimal between 0 and 1. 
    Here is the JSON data: ${jsonString}
    I would like to group the entries by their keys and then compute the average of the values for each group. 
    Please calculate a new output that shows each key along with the average of its associated values. 
    Once you have done that, please return the 4 keys with the highest average value, in the specific format 
    '[key: value, key: value, key: value, key: value]'`;
  };

  // Compute weighted averages and select top 4 emotions
  const getTopEmotions = (scores: Score[]) => {
    const emotionSums: { [emotion: string]: number } = {};
    const emotionCounts: { [emotion: string]: number } = {};

    scores.forEach(score => {
      for (const emotion in score) {
        if (score.hasOwnProperty(emotion)) {
          emotionSums[emotion] = (emotionSums[emotion] || 0) + score[emotion];
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        }
      }
    });

    const emotionAverages: { [emotion: string]: number } = {};
    for (const emotion in emotionSums) {
      if (emotionSums.hasOwnProperty(emotion)) {
        emotionAverages[emotion] = emotionSums[emotion] / (emotionCounts[emotion] || 1);
      }
    }

    const sortedEmotions = Object.entries(emotionAverages).sort((a, b) => b[1] - a[1]);
    return sortedEmotions.slice(0, 4).map(([emotion, score]) => ({ emotion, score }));
  };

  useEffect(() => {
    const topEmotions = getTopEmotions(userScores);
    setTopEmotions(topEmotions);
    console.log('Top 4 Emotions:', topEmotions);
  }, [userScores]);

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
          <div>
            <br></br>
          </div>
          <div className="chat-stage">
            <ChatStage setIsExpanded={setIsExpanded} />
          </div>
        </div>
        <div className="right">
          <TranscriptComponent messages={messages} />
        </div>
      </div>
      <ExpandableComponent isExpanded={isExpanded && !isFading} topEmotions={topEmotions} />
      <OpenAI isExpanded={isExpanded && !isFading} jsonString={JSON.stringify(userScores, null, 2)} setOpenAIResult={setOpenAIResult} />
    </VoiceProvider>
  );
}

export default App;
