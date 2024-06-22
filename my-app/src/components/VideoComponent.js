import React, { useRef, useState, useEffect } from 'react';

const VideoComponent = () => {
  const [stream, setStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    getMediaStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      console.error('Stream is not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.error('mediaRecorderRef.current is null');
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      // Handle the recorded data
      console.log('Recorded data available:', event.data);
    }
  };

  return (
    <div>
      <video autoPlay muted ref={(video) => {
        if (video && stream) {
          video.srcObject = stream;
        }
      }}></video>
    </div>
  );
};

export default VideoComponent;
