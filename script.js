class KinyarwandaTranslator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updateLabels();
    }

    initializeElements() {
        this.sourceLang = document.getElementById('sourceLang');
        this.targetLang = document.getElementById('targetLang');
        this.sourceText = document.getElementById('sourceText');
        this.translatedText = document.getElementById('translatedText');
        this.translateBtn = document.getElementById('translateBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.success = document.getElementById('success');
        this.sourceCount = document.getElementById('sourceCount');
        this.translatedCount = document.getElementById('translatedCount');
        this.sourceLabel = document.getElementById('sourceLabel');
        this.targetLabel = document.getElementById('targetLabel');
    }

    bindEvents() {
        this.translateBtn.addEventListener('click', () => this.translateText());
        this.swapBtn.addEventListener('click', () => this.swapLanguages());
        this.sourceText.addEventListener('input', () => this.updateCharCount());
        this.sourceLang.addEventListener('change', () => this.updateLabels());
        this.targetLang.addEventListener('change', () => this.updateLabels());
        
        // Sample phrases
        document.querySelectorAll('.phrase-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = item.getAttribute('data-text');
                const lang = item.getAttribute('data-lang');
                
                this.sourceText.value = text;
                this.sourceLang.value = lang;
                this.targetLang.value = lang === 'rw' ? 'en' : 'rw';
                this.updateLabels();
                this.updateCharCount();
                this.translateText();
            });
        });
        
        // Enter key to translate
        this.sourceText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.translateText();
            }
        });
    }

    updateLabels() {
        const sourceLangValue = this.sourceLang.value;
        const targetLangValue = this.targetLang.value;
        
        this.sourceLabel.textContent = sourceLangValue === 'rw' ? 'Kinyarwanda:' : 'English:';
        this.targetLabel.textContent = targetLangValue === 'rw' ? 'Kinyarwanda:' : 'English:';
        
        this.sourceText.placeholder = sourceLangValue === 'rw' ? 'Andika hano...' : 'Type here...';
        this.translatedText.placeholder = targetLangValue === 'rw' ? 'Ibisobanuro bizagaragara hano...' : 'Translation will appear here...';
    }

    updateCharCount() {
        const length = this.sourceText.value.length;
        this.sourceCount.textContent = `${length} / 2000 characters`;
        
        if (length > 2000) {
            this.sourceCount.style.color = '#c53030';
            this.translateBtn.disabled = true;
        } else {
            this.sourceCount.style.color = '#666';
            this.translateBtn.disabled = false;
        }
    }

    swapLanguages() {
        const sourceValue = this.sourceLang.value;
        const targetValue = this.targetLang.value;
        const sourceTextValue = this.sourceText.value;
        const translatedTextValue = this.translatedText.value;

        this.sourceLang.value = targetValue;
        this.targetLang.value = sourceValue;
        this.sourceText.value = translatedTextValue;
        this.translatedText.value = sourceTextValue;

        this.updateLabels();
        this.updateCharCount();
        this.updateTranslatedCount();
    }

    async translateText() {
        const text = this.sourceText.value.trim();
        if (!text) {
            this.showError('Please enter text to translate');
            return;
        }

        if (text.length > 2000) {
            this.showError('Text too long. Maximum 2000 characters allowed.');
            return;
        }

        this.showLoading(true);
        this.hideMessages();

        try {
            const translation = await this.callTranslationAPI(text);
            this.translatedText.value = translation;
            this.updateTranslatedCount();
            this.showSuccess('Translation completed successfully!');
        } catch (error) {
            console.error('Translation error:', error);
            this.showError('Translation failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async callTranslationAPI(text) {
        const sourceLang = this.sourceLang.value;
        const targetLang = this.targetLang.value;
        
        try {
            // Using MyMemory Translation API (free, no API key required)
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.responseStatus !== 200) {
                throw new Error(data.responseDetails || 'Translation failed');
            }

            let translation = data.responseData.translatedText;
            
            // Apply Kinyarwanda-specific improvements
            if (targetLang === 'rw') {
                translation = this.improveKinyarwandaTranslation(translation, text);
            } else if (sourceLang === 'rw') {
                translation = this.improveEnglishTranslation(translation, text);
            }

            return translation;
            
        } catch (error) {
            // Fallback to basic dictionary for common phrases
            return this.fallbackTranslation(text, sourceLang, targetLang);
        }
    }

    improveKinyarwandaTranslation(translation, originalText) {
        // Common English to Kinyarwanda improvements
        const improvements = {
            'hello': 'Muraho',
            'good morning': 'Mwaramutse',
            'good afternoon': 'Mwiriwe',
            'good evening': 'Mwiriwe',
            'thank you': 'Murakoze',
            'thank you very much': 'Murakoze cyane',
            'welcome': 'Murakaza neza',
            'goodbye': 'Murabeho',
            'yes': 'Yego',
            'no': 'Oya',
            'please': 'Nyabuneka',
            'excuse me': 'Mbabarira',
            'how are you': 'Mumeze mute?',
            'i am fine': 'Ndabona neza',
            'my name is': 'Nitwa',
            'rwanda': 'U Rwanda',
            'kigali': 'Kigali',
            'welcome to rwanda': 'Murakaza neza mu Rwanda',
            'i love rwanda': 'Ndakunda u Rwanda'
        };

        const lowerOriginal = originalText.toLowerCase();
        if (improvements[lowerOriginal]) {
            return improvements[lowerOriginal];
        }

        return translation;
    }

    improveEnglishTranslation(translation, originalText) {
        // Common Kinyarwanda to English improvements
        const improvements = {
            'muraho': 'Hello',
            'mwaramutse': 'Good morning',
            'mwiriwe': 'Good afternoon/evening',
            'murakoze': 'Thank you',
            'murakoze cyane': 'Thank you very much',
            'murakaza neza': 'Welcome',
            'murabeho': 'Goodbye',
            'yego': 'Yes',
            'oya': 'No',
            'nyabuneka': 'Please',
            'mbabarira': 'Excuse me/Sorry',
            'mumeze mute?': 'How are you?',
            'mumeze mute': 'How are you?',
            'ndabona neza': 'I am fine',
            'nitwa': 'My name is',
            'u rwanda': 'Rwanda',
            'ndakunda u rwanda': 'I love Rwanda',
            'murakaza neza mu rwanda': 'Welcome to Rwanda',
            'kigali': 'Kigali'
        };

        const lowerOriginal = originalText.toLowerCase();
        if (improvements[lowerOriginal]) {
            return improvements[lowerOriginal];
        }

        return translation;
    }

    fallbackTranslation(text, sourceLang, targetLang) {
        const dictionary = {
            'rw_to_en': {
                'muraho': 'Hello',
                'mwaramutse': 'Good morning',
                'mwiriwe': 'Good afternoon',
                'murakoze': 'Thank you',
                'murakoze cyane': 'Thank you very much',
                'murabeho': 'Goodbye',
                'yego': 'Yes',
                'oya': 'No',
                'mumeze mute?': 'How are you?',
                'mumeze mute': 'How are you?',
                'ndabona neza': 'I am fine',
                'nitwa': 'My name is',
                'u rwanda': 'Rwanda',
                'ndakunda u rwanda': 'I love Rwanda',
                'murakaza neza mu rwanda': 'Welcome to Rwanda',
                'kigali': 'Kigali',
                'nyabuneka': 'Please',
                'mbabarira': 'Excuse me'
            },
            'en_to_rw': {
                'hello': 'Muraho',
                'good morning': 'Mwaramutse',
                'good afternoon': 'Mwiriwe',
                'good evening': 'Mwiriwe',
                'thank you': 'Murakoze',
                'thank you very much': 'Murakoze cyane',
                'goodbye': 'Murabeho',
                'yes': 'Yego',
                'no': 'Oya',
                'how are you': 'Mumeze mute?',
                'i am fine': 'Ndabona neza',
                'my name is': 'Nitwa',
                'rwanda': 'U Rwanda',
                'welcome to rwanda': 'Murakaza neza mu Rwanda',
                'i love rwanda': 'Ndakunda u Rwanda',
                'kigali': 'Kigali',
                'please': 'Nyabuneka',
                'excuse me': 'Mbabarira'
            }
        };

        const key = `${sourceLang}_to_${targetLang}`;
        const dict = dictionary[key];
        
        if (dict && dict[text.toLowerCase()]) {
            return dict[text.toLowerCase()];
        }

        throw new Error('Translation not available for this phrase');
    }

    updateTranslatedCount() {
        const length = this.translatedText.value.length;
        this.translatedCount.textContent = `${length} characters`;
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
        this.translateBtn.disabled = show;
    }

    showError(message) {
        this.error.textContent = message;
        this.error.style.display = 'block';
        setTimeout(() => this.hideMessages(), 5000);
    }

    showSuccess(message) {
        this.success.textContent = message;
        this.success.style.display = 'block';
        setTimeout(() => this.hideMessages(), 3000);
    }

    hideMessages() {
        this.error.style.display = 'none';
        this.success.style.display = 'none';
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KinyarwandaTranslator();
});




