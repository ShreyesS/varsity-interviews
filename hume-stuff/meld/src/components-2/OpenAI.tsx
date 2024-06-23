import React, { useEffect } from 'react';

interface Props {
  isExpanded: boolean;
  jsonString: string;
  setOpenAIResult: (result: string) => void; // Add setOpenAIResult prop
}

const OpenAI: React.FC<Props> = ({ isExpanded, jsonString, setOpenAIResult }) => {
  useEffect(() => {
    if (isExpanded) {
      sendToOpenAI();
    }
  }, [isExpanded]);

  const sendToOpenAI = async () => {
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

  return (
    <div>
      {/* Any additional UI or functionality can go here */}
    </div>
  );
};

export default OpenAI;
