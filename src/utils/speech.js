let recognition = null;

// Voice Input (speech-to-text)
export const startListening = (onResult) => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech Recognition not supported');
    return;
  }

  if (!recognition) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      recognition.stop();
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
    };
  }

  try {
    recognition.start();
  } catch (err) {
    console.warn('Recognition already started, stopping and restarting...');
    recognition.stop();
    setTimeout(() => recognition.start(), 200);
  }
};

export const stopListening = () => {
  if (recognition) recognition.stop();
};

// Text-to-Speech
export const speakText = (text, lang = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    alert('Text-to-Speech not supported');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang; // 'en-US', 'hi-IN', 'sa-IN' etc.
  window.speechSynthesis.speak(utterance);
};
