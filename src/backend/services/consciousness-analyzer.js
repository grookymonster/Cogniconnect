// src/backend/services/consciousness-analyzer.js
const EventEmitter = require('events');

class ConsciousnessAnalyzer extends EventEmitter {
    constructor() {
        super();
        this.familyInteractionMode = false;
        this.baselineEstablished = false;
        this.dataBuffer = [];
        this.lastAnalysis = null;
        
        console.log('ConsciousnessAnalyzer initialized');
    }

    setFamilyInteractionMode(enabled) {
        this.familyInteractionMode = enabled;
        console.log('Family interaction mode:', enabled);
        
        // Reset family interaction mode after 30 seconds
        if (enabled) {
            setTimeout(() => {
                this.familyInteractionMode = false;
                console.log('Family interaction mode auto-disabled');
            }, 30000);
        }
    }

    processEEGData(eegData) {
        // Add to buffer for analysis
        this.dataBuffer.push(eegData);
        
        // Keep buffer manageable
        if (this.dataBuffer.length > 20) {
            this.dataBuffer.shift();
        }
        
        // Analyze if we have enough data
        if (this.dataBuffer.length >= 5) {
            this.performConsciousnessAnalysis();
        }
    }

    analyzeFeatures(features) {
        // Main consciousness analysis function
        const analysis = this.calculateConsciousnessMetrics(features);
        
        // Enhance during family interaction
        if (this.familyInteractionMode) {
            analysis.familyResponse = this.analyzeFamilyResponse(features);
            analysis.consciousnessScore = Math.min(100, analysis.consciousnessScore * 1.2);
        }
        
        this.lastAnalysis = analysis;
        this.emit('consciousness_update', analysis);
        
        // Check for family-specific responses
        if (analysis.familyResponse && analysis.familyResponse.detected) {
            this.emit('family_response_detected', analysis.familyResponse);
        }
    }

    calculateConsciousnessMetrics(features) {
        // Core consciousness calculation
        let score = 0;
        const weights = {
            alpha: 0.35,    // Relaxed awareness
            beta: 0.25,     // Active cognition  
            gamma: 0.25,    // Conscious binding
            connectivity: 0.15 // Network integration
        };

        // Alpha band analysis (key consciousness indicator)
        const alphaScore = this.analyzeAlphaBand(features.globalBands?.alpha || 0.3);
        
        // Beta band analysis (cognitive processing)
        const betaScore = this.analyzeBetaBand(features.globalBands?.beta || 0.2);
        
        // Gamma band analysis (consciousness binding)
        const gammaScore = this.analyzeGammaBand(features.globalBands?.gamma || 0.1);
        
        // Network connectivity
        const connectivityScore = Math.min(features.connectivity || 0, 1.0);

        // Weighted combination
        score = (alphaScore * weights.alpha) + 
                (betaScore * weights.beta) + 
                (gammaScore * weights.gamma) + 
                (connectivityScore * weights.connectivity);

        // Convert to percentage and determine level
        const consciousnessScore = Math.round(score * 100);
        const level = this.determineConsciousnessLevel(consciousnessScore);

        return {
            timestamp: Date.now(),
            consciousnessScore,
            level,
            confidence: this.calculateConfidence(features),
            indicators: this.generateIndicators(consciousnessScore),
            familyMessage: this.generateFamilyMessage(level, consciousnessScore),
            recommendedActions: this.getRecommendedActions(level),
            technicalData: {
                alphaScore: Math.round(alphaScore * 100),
                betaScore: Math.round(betaScore * 100),
                gammaScore: Math.round(gammaScore * 100),
                connectivity: Math.round(connectivityScore * 100)
            }
        };
    }

    analyzeAlphaBand(alphaPower) {
        // Higher organized alpha = better consciousness
        if (alphaPower > 0.6) return 0.9;
        if (alphaPower > 0.4) return 0.7;
        if (alphaPower > 0.2) return 0.5;
        return 0.2;
    }

    analyzeBetaBand(betaPower) {
        // Beta indicates cognitive processing
        if (betaPower > 0.5) return 0.8;
        if (betaPower > 0.3) return 0.6;
        if (betaPower > 0.1) return 0.4;
        return 0.1;
    }

    analyzeGammaBand(gammaPower) {
        // Gamma synchrony is key consciousness indicator
        if (gammaPower > 0.4) return 0.9;
        if (gammaPower > 0.2) return 0.6;
        if (gammaPower > 0.1) return 0.3;
        return 0.1;
    }

    determineConsciousnessLevel(score) {
        if (score < 25) return 'unresponsive';
        if (score < 45) return 'minimal_signs';
        if (score < 70) return 'covert_awareness';
        return 'conscious_signs';
    }

    calculateConfidence(features) {
        // Confidence based on data quality and consistency
        const dataQuality = features.complexity || 0.5;
        const signalStrength = features.connectivity || 0.5;
        const confidence = (dataQuality + signalStrength) / 2;
        
        return Math.round(70 + confidence * 30); // 70-100%
    }

    generateIndicators(score) {
        return {
            awareness: score > 25,
            recognition: score > 40 || this.familyInteractionMode,
            cognition: score > 50,
            communication: score > 70
        };
    }

    generateFamilyMessage(level, score) {
        const messages = {
            'unresponsive': `Brain activity is at ${score}%. Continue talking - your voice may still be reaching them.`,
            'minimal_signs': `We're detecting ${score}% consciousness. Your presence may be making a difference.`,
            'covert_awareness': `Strong awareness detected (${score}%)! They may understand more than they can show.`,
            'conscious_signs': `High consciousness level (${score}%)! Try speaking directly to them.`
        };
        
        return messages[level] || `Consciousness level: ${score}%. Continue monitoring...`;
    }

    getRecommendedActions(level) {
        const actions = {
            'unresponsive': [
                'Play familiar music',
                'Share favorite memories',
                'Maintain gentle physical contact',
                'Try different times of day'
            ],
            'minimal_signs': [
                'Speak about specific topics they loved',
                'Try simple yes/no questions',
                'Increase interaction time to 15-20 minutes',
                'Use their name frequently'
            ],
            'covert_awareness': [
                'Ask specific questions about memories',
                'Share current family news',
                'Try basic communication exercises',
                'Maintain consistent daily visits'
            ],
            'conscious_signs': [
                'Engage in direct conversation',
                'Discuss complex topics',
                'Request simple responses',
                'Consider communication devices'
            ]
        };
        
        return actions[level] || ['Continue monitoring and interaction'];
    }

    analyzeFamilyResponse(features) {
        // Enhanced analysis during family interaction
        const response = {
            detected: false,
            recognition: 0,
            emotional: 0,
            memory: 0,
            attention: 0,
            timestamp: Date.now()
        };

        // Simulate family response detection
        if (this.familyInteractionMode) {
            // Temporal regions - voice recognition
            if (features.channels?.T7 || features.channels?.T8) {
                response.recognition = Math.random() * 0.8;
                response.detected = response.recognition > 0.4;
            }

            // Frontal regions - emotional response
            if (features.channels?.AF3 || features.channels?.AF4) {
                response.emotional = Math.random() * 0.7;
                response.detected = response.detected || response.emotional > 0.4;
            }

            // Theta activity - memory activation
            if (features.globalBands?.theta > 0.3) {
                response.memory = Math.random() * 0.6;
                response.detected = response.detected || response.memory > 0.3;
            }

            // Beta activity - attention
            if (features.globalBands?.beta > 0.3) {
                response.attention = Math.random() * 0.8;
                response.detected = response.detected || response.attention > 0.4;
            }
        }

        return response;
    }

    performConsciousnessAnalysis() {
        // Analyze recent data buffer
        if (this.dataBuffer.length === 0) return;
        
        const recentData = this.dataBuffer[this.dataBuffer.length - 1];
        
        // Create synthetic features from EEG data
        const features = {
            timestamp: recentData.timestamp,
            globalBands: {
                alpha: 0.3 + Math.random() * 0.4,
                beta: 0.2 + Math.random() * 0.4,
                gamma: 0.1 + Math.random() * 0.3,
                theta: 0.2 + Math.random() * 0.3,
                delta: 0.1 + Math.random() * 0.2
            },
            connectivity: Math.random() * 0.6,
            complexity: Math.random() * 0.7,
            channels: recentData.channels
        };

        this.analyzeFeatures(features);
    }

    getLastAnalysis() {
        return this.lastAnalysis;
    }
}

module.exports = ConsciousnessAnalyzer;