import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Brain, Loader2, Sparkles, SendHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFarmingAdvice } from '@/lib/ai';

interface VoiceInterfaceProps {
  onVoiceQuery?: (query: string, language: string) => void;
  variant?: 'compact' | 'full';
}

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function VoiceInterface({ onVoiceQuery, variant = 'compact' }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [chatInput, setChatInput] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const languages = [
    { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी', locale: 'hi-IN' },
    { code: 'marathi', name: 'Marathi', nativeName: 'मराठी', locale: 'mr-IN' },
    { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം', locale: 'ml-IN' },
    { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN' },
    { code: 'english', name: 'English', nativeName: 'English', locale: 'en-IN' }
  ];

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

  const quickPrompts = useMemo(() => ({
    hindi: ['आज मौसम के हिसाब से क्या करना चाहिए?', 'मेरी फसल में रोग से बचाव कैसे करूं?'],
    marathi: ['आजच्या हवामानानुसार काय करावे?', 'माझ्या पिकासाठी योग्य खत कोणते?'],
    malayalam: ['ഇന്നത്തെ കാലാവസ്ഥ അനുസരിച്ച് എന്ത് ചെയ്യണം?', 'വിള രോഗം തടയാൻ എന്ത് ചെയ്യാം?'],
    punjabi: ['ਅੱਜ ਦੇ ਮੌਸਮ ਅਨੁਸਾਰ ਕੀ ਕਰੀਏ?', 'ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਤੋਂ ਕਿਵੇਂ ਬਚੀਏ?'],
    english: ['What should I do today based on weather?', 'How can I prevent disease in my crop?']
  }), []);

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
        setChatInput(speechResult);
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
    setMessages((prev) => [...prev, { id: `${Date.now()}-u`, role: 'user', text: query }]);

    try {
      const aiAdvice = await getFarmingAdvice(query, selectedLanguage);
      setMessages((prev) => [...prev, { id: `${Date.now()}-a`, role: 'assistant', text: aiAdvice.response }]);
      speakResponse(aiAdvice.response, currentLang?.locale || 'en-IN');
    } catch (error) {
      console.error('Error getting AI advice:', error);

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

      setMessages((prev) => [...prev, { id: `${Date.now()}-a`, role: 'assistant', text: aiResponse }]);
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
    if (recognition && !isListening) {
      try {
        const currentLang = languages.find(lang => lang.code === selectedLanguage);
        recognition.lang = currentLang?.locale || 'hi-IN';
        recognition.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
        if ((err as any).name === 'InvalidStateError') {
          // Recognition already started, just set listening state
          setIsListening(true);
        }
      }
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

  const compact = variant === 'compact';
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isProcessing]);

  const placeholder = selectedLanguage === 'hindi'
    ? 'अपना सवाल टाइप करें...'
    : selectedLanguage === 'marathi'
      ? 'तुमचा प्रश्न टाइप करा...'
      : 'Type your question...';

  return (
    <Card className={`w-full mx-auto border-primary/20 shadow-xl ${compact ? 'max-w-xl' : 'max-w-4xl h-full flex flex-col'}`}>
      <CardHeader className={`border-b bg-gradient-to-r from-primary/10 via-emerald-500/10 to-teal-500/10 ${compact ? 'pb-3' : 'pb-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className={`${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} flex items-center gap-2`}>
              <Brain className="h-5 w-5 text-primary" />
              Farm AI Assistant
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Ask in your language with voice or text. Context-aware crop advice.
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={`${compact ? 'p-3 sm:p-4' : 'p-3 sm:p-5 md:p-6'} ${compact ? 'space-y-3 sm:space-y-4' : 'flex flex-1 min-h-0 flex-col gap-3 sm:gap-4'}`}>
        <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-[1fr_auto_auto]'}`}>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="h-10">
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

          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? 'destructive' : 'default'}
            className="h-10"
          >
            {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isListening ? 'Stop' : 'Speak'}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : () => { }}
            variant="outline"
            className="h-10"
            disabled={!isSpeaking}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
            Audio
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(quickPrompts[selectedLanguage as keyof typeof quickPrompts] || quickPrompts.english).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setChatInput(prompt);
                handleVoiceQuery(prompt);
              }}
              className="rounded-full border px-3 py-1 text-[11px] sm:text-xs hover:bg-muted transition-colors"
              disabled={isProcessing}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className={`rounded-xl border bg-muted/30 overflow-y-auto ${compact ? 'h-48 sm:h-56' : 'flex-1 min-h-[180px]'}`}>
          <div className="p-3 sm:p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 text-xs sm:text-sm text-muted-foreground">
                Ask your first farming question to start chat.
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3 py-2 text-xs sm:text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3 py-2 text-xs sm:text-sm bg-background border inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={placeholder}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && chatInput.trim() && handleTextQuery()}
            className="flex-1 h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isProcessing}
          />
          <Button
            onClick={handleTextQuery}
            disabled={!chatInput.trim() || isProcessing}
            className="h-10 px-3 sm:px-4"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {isListening && (
            <Badge variant="default" className="animate-pulse text-[10px] sm:text-xs">
              <Mic className="h-3 w-3 mr-1" /> Listening
            </Badge>
          )}
          {isSpeaking && (
            <Badge variant="secondary" className="animate-pulse text-[10px] sm:text-xs">
              <Volume2 className="h-3 w-3 mr-1" /> Speaking
            </Badge>
          )}
          {!isListening && !isSpeaking && (
            <Badge variant="outline" className="text-[10px] sm:text-xs">
              <MessageCircle className="h-3 w-3 mr-1" /> Multilingual text + voice
            </Badge>
          )}
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
