import VoiceInterface from '@/components/VoiceInterface';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles } from 'lucide-react';

export default function AssistantPage() {
  return (
    <div className="h-[calc(100dvh-56px)] sm:h-[calc(100dvh-64px)] bg-background">
      <div className="container h-full px-3 sm:px-4 py-2 sm:py-3 md:py-4 flex flex-col gap-2 sm:gap-3">
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2">
            <Badge variant="outline" className="text-xs sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500" />
              AI Assistant
            </Badge>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
            <Brain className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
            Farm Assistant Chat
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Chat with voice or text in your preferred language. Answers are grounded in your crop data,
            weather context, and recent farm actions.
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <VoiceInterface variant="full" />
        </div>
      </div>
    </div>
  );
}
