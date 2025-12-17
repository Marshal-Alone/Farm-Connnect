import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Brain, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { groqAI } from '@/lib/groq';

interface VoiceInterfaceProps {
  onVoiceQuery?: (query: string, language: string) => void;
}

export default function VoiceInterface({ onVoiceQuery }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  const languages = [
    { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी', locale: 'hi-IN' },
    { code: 'marathi', name: 'Marathi', nativeName: 'मराठी', locale: 'mr-IN' },
    { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം', locale: 'ml-IN' },
    { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN' },
    { code: 'english', name: 'English', nativeName: 'English', locale: 'en-IN' }
  ];

  // Sample responses for different languages
  const sampleResponses = {
    hindi: {
      'मौसम': 'आज बारिश की संभावना है। अपनी फसल को सुरक्षित रखें।',
      'फसल': 'आपकी गेहूं की फसल अच्छी दिख रही है। अगले सप्ताह कटाई का समय है।',
      'खाद': 'नाइट्रोजन की कमी दिख रही है। यूरिया का छिड़काव करें।',
      'default': 'मैं आपकी मदद करने के लिए यहाँ हूँ। कृपया अपना प्रश्न पूछें।'
    },
    english: {
      'weather': 'There is a chance of rain today. Please protect your crops.',
      'crop': 'Your wheat crop looks healthy. Harvest time is next week.',
      'fertilizer': 'Nitrogen deficiency detected. Apply urea fertilizer.',
      'default': 'I\'m here to help you. Please ask your farming question.'
    },
    marathi: {
      'मौसम': 'आज पाऊस येण्याची शक्यता आहे। तुमच्या पिकांचे संरक्षण करा.',
      'पीक': 'तुमचे गहूच्या पिकाचे आरोग्य चांगले आहे। पुढच्या आठवड्यात कापणीची वेळ आहे.',
      'खत': 'नायट्रोजनची कमतरता दिसत आहे। युरिया फवारणी करा.',
      'default': 'मी तुमची मदत करण्यासाठी येथे आहे. कृपया तुमचा प्रश्न विचारा.'
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Recognition Started",
          description: "Speak now...",
        });
      };

      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleVoiceQuery(speechResult);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  }, [selectedLanguage]);

  const handleVoiceQuery = async (query: string) => {
    const currentLang = languages.find(lang => lang.code === selectedLanguage);
    setIsProcessing(true);

    try {
      // Get AI-powered response using Groq
      const aiAdvice = await groqAI.getFarmingAdvice(query, selectedLanguage);
      setResponse(aiAdvice.response);
      speakResponse(aiAdvice.response, currentLang?.locale || 'en-IN');

      toast({
        title: "AI Response Generated",
        description: `Advice category: ${aiAdvice.category}`,
      });
    } catch (error) {
      console.error('Error getting AI advice:', error);

      // Fallback to sample responses
      let aiResponse = '';
      const queryLower = query.toLowerCase();

      if (selectedLanguage === 'hindi') {
        if (queryLower.includes('मौसम') || queryLower.includes('बारिश')) {
          aiResponse = sampleResponses.hindi['मौसम'];
        } else if (queryLower.includes('फसल') || queryLower.includes('गेहूं')) {
          aiResponse = sampleResponses.hindi['फसल'];
        } else if (queryLower.includes('खाद') || queryLower.includes('उर्वरक')) {
          aiResponse = sampleResponses.hindi['खाद'];
        } else {
          aiResponse = sampleResponses.hindi['default'];
        }
      } else if (selectedLanguage === 'english') {
        if (queryLower.includes('weather') || queryLower.includes('rain')) {
          aiResponse = sampleResponses.english['weather'];
        } else if (queryLower.includes('crop') || queryLower.includes('wheat')) {
          aiResponse = sampleResponses.english['crop'];
        } else if (queryLower.includes('fertilizer') || queryLower.includes('nutrient')) {
          aiResponse = sampleResponses.english['fertilizer'];
        } else {
          aiResponse = sampleResponses.english['default'];
        }
      } else if (selectedLanguage === 'marathi') {
        if (queryLower.includes('मौसम') || queryLower.includes('पाऊस')) {
          aiResponse = sampleResponses.marathi['मौसम'];
        } else if (queryLower.includes('पीक') || queryLower.includes('गहू')) {
          aiResponse = sampleResponses.marathi['पीक'];
        } else if (queryLower.includes('खत') || queryLower.includes('युरिया')) {
          aiResponse = sampleResponses.marathi['खत'];
        } else {
          aiResponse = sampleResponses.marathi['default'];
        }
      }

      setResponse(aiResponse);
      speakResponse(aiResponse, currentLang?.locale || 'en-IN');
    } finally {
      setIsProcessing(false);
    }

    // Call parent component handler if provided
    if (onVoiceQuery) {
      onVoiceQuery(query, selectedLanguage);
    }
  };

  const handleTextQuery = () => {
    if (!chatInput.trim()) return;
    setTranscript(chatInput);
    handleVoiceQuery(chatInput);
    setChatInput('');
  };

  const speakResponse = (text: string, locale: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale;
      utterance.rate = 0.8;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition) {
      const currentLang = languages.find(lang => lang.code === selectedLanguage);
      recognition.lang = currentLang?.locale || 'hi-IN';
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold">AI Voice Assistant</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask me anything about farming in your preferred language
          </p>
          <Badge variant="outline" className="mt-2">
            Powered by AI Analysis
          </Badge>
        </div>

        {/* Language Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Select Language</label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className="relative"
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Stop
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Speak
              </>
            )}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : () => { }}
            variant={isSpeaking ? "destructive" : "outline"}
            size="lg"
            disabled={!isSpeaking}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-5 w-5 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 mr-2" />
                Audio
              </>
            )}
          </Button>
        </div>

        {/* Text Chat Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={selectedLanguage === 'hindi' ? 'अपना सवाल टाइप करें...' :
              selectedLanguage === 'marathi' ? 'तुमचा प्रश्न टाइप करा...' :
                'Type your question...'}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && chatInput.trim() && handleTextQuery()}
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isProcessing}
          />
          <Button
            onClick={handleTextQuery}
            disabled={!chatInput.trim() || isProcessing}
            size="default"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
          </Button>
        </div>

        {/* Status */}
        <div className="text-center">
          {isListening && (
            <Badge variant="default" className="animate-pulse">
              <Mic className="h-3 w-3 mr-1" />
              Listening...
            </Badge>
          )}
          {isProcessing && (
            <Badge variant="secondary" className="animate-pulse">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              AI Thinking...
            </Badge>
          )}
          {isSpeaking && (
            <Badge variant="secondary" className="animate-pulse">
              <Volume2 className="h-3 w-3 mr-1" />
              Speaking...
            </Badge>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-secondary/20 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <MessageCircle className="h-4 w-4 mt-1 text-primary" />
              <div>
                <p className="text-sm font-medium">You said:</p>
                <p className="text-sm text-muted-foreground">{transcript}</p>
              </div>
            </div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Volume2 className="h-4 w-4 mt-1 text-primary" />
              <div>
                <p className="text-sm font-medium">AI Assistant:</p>
                <p className="text-sm">{response}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Queries */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {selectedLanguage === 'hindi' && (
              <>
                <Badge variant="outline" className="text-xs">"मौसम कैसा है?"</Badge>
                <Badge variant="outline" className="text-xs">"फसल की जांच करो"</Badge>
              </>
            )}
            {selectedLanguage === 'english' && (
              <>
                <Badge variant="outline" className="text-xs">"How's the weather?"</Badge>
                <Badge variant="outline" className="text-xs">"Check my crops"</Badge>
              </>
            )}
            {selectedLanguage === 'marathi' && (
              <>
                <Badge variant="outline" className="text-xs">"मौसम कसे आहे?"</Badge>
                <Badge variant="outline" className="text-xs">"पिकांची तपासणी करा"</Badge>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}