import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PROMPT_DISMISS_KEY = "farmconnect_install_prompt_dismissed_at";
const PROMPT_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 3;

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const dismissedAt = Number(localStorage.getItem(PROMPT_DISMISS_KEY) || 0);
  const canShowPrompt = Date.now() - dismissedAt > PROMPT_COOLDOWN_MS;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (canShowPrompt && !isStandalone) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setShowIosHint(false);
      setDeferredPrompt(null);
      localStorage.removeItem(PROMPT_DISMISS_KEY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (!isStandalone && isIos && canShowPrompt) {
      setShowIosHint(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [canShowPrompt, isIos, isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(PROMPT_DISMISS_KEY, Date.now().toString());
    setShowPrompt(false);
    setShowIosHint(false);
  };

  if (!showPrompt && !showIosHint) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border shadow-lg md:left-auto md:right-4 md:max-w-xs">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Download className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Install App</h3>
              <p className="text-xs text-muted-foreground">
                {showIosHint ? "Use Safari Share > Add to Home Screen" : "Add to home screen"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Install FarmConnect for quick access, better mobile performance, and offline use.
        </p>
        <div className="flex space-x-2">
          {!showIosHint && deferredPrompt ? (
            <Button
              onClick={handleInstall}
              size="sm"
              className="flex-1 text-xs"
            >
              Install
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setShowIosHint(false)}
            >
              Got it
            </Button>
          )}
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Not now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
