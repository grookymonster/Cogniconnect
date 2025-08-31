// test-emotiv.js
const EmotivService = require('./src/backend/services/emotiv-service');

// Create service in simulation mode
const eeg = new EmotivService({ simulateData: true });

eeg.on('connected', () => {
  console.log('✅ Connected to EEG (simulation mode)');
});

eeg.on('eeg_data', (data) => {
  console.log('📊 EEG data sample:', {
    timestamp: data.timestamp,
    AF3: data.channels.AF3.toFixed(3), // just log one channel
    AF4: data.channels.AF4.toFixed(3),
    quality: data.quality
  });
});

eeg.on('consciousness_features', (features) => {
  console.log('🧠 Consciousness Index:', features.consciousnessIndex.toFixed(3));
});

eeg.on('disconnected', () => {
  console.log('❌ EEG disconnected');
});

// Start simulation
(async () => {
  await eeg.connect();

  // Stop after 5 seconds so it doesn’t run forever
  setTimeout(() => {
    eeg.disconnect();
  }, 5000);
})();
