

// src/backend/services/emotiv-service.js
const EventEmitter = require('events');

class EmotivService extends EventEmitter {
    constructor(options = {}) {
        super();
        this.useSimulatedData = options.simulateData ?? true; // defaults to true
        this.isConnected = false;
        this.simulationInterval = null;
        this.consciousnessLevel = 0.6; // Start with moderate consciousness

        console.log('EmotivService initialized (simulation mode)');
    }

    async connect() {
        console.log('Starting EEG simulation...');
        this.isConnected = true;
        this.emit('connected');

        // Start generating simulated EEG data every 250ms
        this.simulationInterval = setInterval(() => {
            this.generateSimulatedData();
        }, 250);

        return true;
    }

    generateSimulatedData() {
        const timestamp = Date.now();

        // Generate realistic EEG data for vegetative state monitoring
        const channels = {
            'AF3': this.generateChannelData('frontal'),
            'AF4': this.generateChannelData('frontal'),
            'F3': this.generateChannelData('frontal'),
            'F4': this.generateChannelData('frontal'),
            'F7': this.generateChannelData('frontal'),
            'F8': this.generateChannelData('frontal'),
            'T7': this.generateChannelData('temporal'),
            'T8': this.generateChannelData('temporal'),
            'P7': this.generateChannelData('parietal'),
            'P8': this.generateChannelData('parietal'),
            'O1': this.generateChannelData('occipital'),
            'O2': this.generateChannelData('occipital')
        };

        // Emit EEG data
        this.emit('eeg_data', {
            timestamp,
            channels,
            sampleRate: 128,
            quality: 'good'
        });

        // Generate consciousness features periodically
        if (Math.random() < 0.3) { // 30% chance each cycle
            this.generateConsciousnessFeatures(timestamp, channels);
        }
    }

    generateChannelData(region) {
        const time = Date.now() / 1000;
        let signal = 0;

        // Different patterns for different brain regions
        switch(region) {
            case 'frontal':
                signal = this.generateBrainWave('alpha', 0.7, time) + 
                        this.generateBrainWave('beta', 0.5, time) +
                        this.generateBrainWave('gamma', 0.3 * this.consciousnessLevel, time);
                break;
            case 'temporal':
                signal = this.generateBrainWave('alpha', 0.8, time) + 
                        this.generateBrainWave('theta', 0.6, time) +
                        this.generateBrainWave('beta', 0.4, time);
                break;
            case 'parietal':
                signal = this.generateBrainWave('alpha', 0.6, time) + 
                        this.generateBrainWave('beta', 0.7, time) +
                        this.generateBrainWave('gamma', 0.4, time);
                break;
            case 'occipital':
                signal = this.generateBrainWave('alpha', 0.9, time) + 
                        this.generateBrainWave('theta', 0.3, time);
                break;
        }

        // Add noise
        signal += (Math.random() - 0.5) * 0.4;

        // Consciousness effects
        if (this.consciousnessLevel < 0.3) {
            signal += this.generateBrainWave('delta', 0.8, time);
        }

        return signal;
    }

    generateBrainWave(type, amplitude, time) {
        const frequencies = {
            delta: 2,   // 0.5-4 Hz
            theta: 6,   // 4-8 Hz  
            alpha: 10,  // 8-12 Hz
            beta: 20,   // 12-30 Hz
            gamma: 40   // 30-100 Hz
        };

        const freq = frequencies[type] || 10;
        return amplitude * Math.sin(2 * Math.PI * freq * time);
    }

    generateConsciousnessFeatures(timestamp, channels) {
        // Example feature extraction: overall alpha/beta ratio
        const values = Object.values(channels);
        const avgSignal = values.reduce((a, b) => a + b, 0) / values.length;

        // Simplified consciousness index
        const consciousnessIndex = Math.min(1, Math.max(0, 0.5 + avgSignal * 0.01));

        this.emit('consciousness_features', {
            timestamp,
            consciousnessIndex
        });
    }

    disconnect() {
        clearInterval(this.simulationInterval);
        this.isConnected = false;
        this.emit('disconnected');
        console.log('EEG simulation stopped');
    }
}

module.exports = EmotivService;
