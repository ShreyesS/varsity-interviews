import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || 'your-hugging-face-api-key';

// Example function to fetch a token from Hugging Face (this may vary based on your actual use case)
const fetchHuggingFaceToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post('https://api.huggingface.co/your/token/endpoint', {
      apiKey: HUGGING_FACE_API_KEY,
    });
    return response.data.token;
  } catch (error) {
    console.error('Error fetching Hugging Face token:', error);
    return null;
  }
};

app.post('/api/save-scores', (req: Request, res: Response) => {
  const scores = req.body;
  const filePath = path.join(__dirname, 'userScores.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let existingScores = [];
    if (!err) {
      existingScores = JSON.parse(data);
    }

    const updatedScores = [...existingScores, ...scores];

    fs.writeFile(filePath, JSON.stringify(updatedScores, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing scores to file:', err);
        return res.status(500).json({ message: 'Failed to save scores' });
      }
      console.log('Scores successfully saved to userScores.json');
      res.status(200).json({ message: 'Scores saved successfully' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
