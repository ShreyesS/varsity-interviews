import React, { useEffect, useRef } from 'react';

const LiveAudioWaveform: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const initializeAudio = async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        const audioContext = audioContextRef.current;

        if (!analyserRef.current) {
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;
        }

        const analyser = analyserRef.current;

        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        try {
            const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = userStream;
            const source = audioContext.createMediaStreamSource(userStream);
            source.connect(analyser);
            draw();
        } catch (err) {
            console.error('Error accessing audio stream', err);
        }
    };

    const draw = () => {
        if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const radius = (Math.min(canvas.width, canvas.height) - padding * 2) / 8; // Reduced size
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        canvasCtx.lineWidth = 10; // Thicker lines
        const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0000ff'); // Blue
        gradient.addColorStop(0.5, '#00bfff'); // DeepSkyBlue
        gradient.addColorStop(1, '#87ceeb'); // SkyBlue
        canvasCtx.strokeStyle = gradient;

        canvasCtx.beginPath();

        for (let i = 0; i < dataArrayRef.current.length; i++) {
            const angle = (i / dataArrayRef.current.length) * 2 * Math.PI;
            const v = dataArrayRef.current[i] / 128.0;
            const outerRadius = radius + v * 75; // Adjusted amplitude for smoother effect
            const x = centerX + outerRadius * Math.cos(angle);
            const y = centerY + outerRadius * Math.sin(angle);

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                const prevAngle = ((i - 1) / dataArrayRef.current.length) * 2 * Math.PI;
                const prevOuterRadius = radius + dataArrayRef.current[i - 1] / 128.0 * 75;
                const prevX = centerX + prevOuterRadius * Math.cos(prevAngle);
                const prevY = centerY + prevOuterRadius * Math.sin(prevAngle);
                const cp1x = (prevX + x) / 2;
                const cp1y = (prevY + y) / 2;
                canvasCtx.quadraticCurveTo(cp1x, cp1y, x, y);
            }
        }

        canvasCtx.closePath();
        canvasCtx.stroke();

        animationFrameRef.current = requestAnimationFrame(draw);
    };

    useEffect(() => {
        const handleUserGesture = async () => {
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            initializeAudio();
        };

        window.addEventListener('click', handleUserGesture);
        window.addEventListener('start', handleUserGesture);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            analyserRef.current = null;
            dataArrayRef.current = null;

            window.removeEventListener('click', handleUserGesture);
            window.removeEventListener('touchstart', handleUserGesture);
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} width="300" height="300" style={{ backgroundColor: '#FFFFFF', borderRadius: '30px' }} />
        </div>
    );
};

export default LiveAudioWaveform;