import { AIContentService } from '../ai/AIContentService.js';
export class SubtitleService {
    aiService;
    constructor() {
        this.aiService = new AIContentService();
    }
    /**
     * Generate subtitles from audio transcript or text
     */
    async generateSubtitles(text, audioDuration, language = 'english', userId) {
        // Split text into sentences
        const sentences = this.splitIntoSentences(text);
        // Calculate timing for each sentence
        const segments = [];
        let currentTime = 0;
        for (const sentence of sentences) {
            // Estimate duration based on reading speed (words per minute)
            const wordsPerMinute = this.getReadingSpeed(language);
            const wordCount = sentence.split(/\s+/).length;
            const duration = (wordCount / wordsPerMinute) * 60;
            // Ensure we don't exceed audio duration
            if (currentTime + duration > audioDuration) {
                const remainingTime = audioDuration - currentTime;
                if (remainingTime > 0) {
                    segments.push({
                        text: sentence,
                        startTime: currentTime,
                        duration: remainingTime,
                    });
                }
                break;
            }
            segments.push({
                text: sentence,
                startTime: currentTime,
                duration: duration,
            });
            currentTime += duration + 0.5; // 0.5s gap between subtitles
        }
        return segments;
    }
    /**
     * Generate word-level timing (for advanced subtitle effects)
     */
    async generateWordLevelTiming(text, audioDuration, language) {
        const segments = await this.generateSubtitles(text, audioDuration, language);
        // Enhance with word-level timing
        return segments.map(segment => {
            const words = segment.text.split(/\s+/);
            const wordDuration = segment.duration / words.length;
            const wordTimings = words.map((word, index) => ({
                word,
                startTime: segment.startTime + (index * wordDuration),
                duration: wordDuration,
            }));
            return {
                ...segment,
                words: wordTimings,
            };
        });
    }
    /**
     * Auto-translate subtitles to target language
     */
    async translateSubtitles(subtitles, targetLanguage, userId) {
        const translatedTexts = await Promise.all(subtitles.map(subtitle => this.aiService.generateContent({
            prompt: subtitle.text,
            language: targetLanguage,
            generationType: 'translation',
        }, userId)));
        return subtitles.map((subtitle, index) => ({
            ...subtitle,
            text: translatedTexts[index].text,
        }));
    }
    /**
     * Format subtitles as SRT (SubRip) format
     */
    formatSRT(subtitles) {
        return subtitles
            .map((subtitle, index) => {
            const start = this.formatSRTTime(subtitle.startTime);
            const end = this.formatSRTTime(subtitle.startTime + subtitle.duration);
            return `${index + 1}\n${start} --> ${end}\n${subtitle.text}\n`;
        })
            .join('\n');
    }
    /**
     * Format subtitles as VTT (WebVTT) format
     */
    formatVTT(subtitles) {
        let vtt = 'WEBVTT\n\n';
        subtitles.forEach(subtitle => {
            const start = this.formatVTTTime(subtitle.startTime);
            const end = this.formatVTTTime(subtitle.startTime + subtitle.duration);
            vtt += `${start} --> ${end}\n${subtitle.text}\n\n`;
        });
        return vtt;
    }
    splitIntoSentences(text) {
        // Simple sentence splitting (can be enhanced with NLP)
        return text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }
    getReadingSpeed(language) {
        // Average reading speeds (words per minute) by language
        const speeds = {
            english: 200,
            malayalam: 180,
            tamil: 180,
            hindi: 200,
            telugu: 180,
            kannada: 180,
            spanish: 200,
            french: 200,
        };
        return speeds[language.toLowerCase()] || 200;
    }
    formatSRTTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const millis = Math.floor((seconds % 1) * 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
    }
    formatVTTTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const millis = Math.floor((seconds % 1) * 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
    }
}
//# sourceMappingURL=SubtitleService.js.map