import { usePWA } from '@/hooks/usePWA';
import { Badge } from '@/components/ui/badge';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <Badge variant="destructive" className="flex items-center space-x-1 px-3 py-1">
        <WifiOff className="h-3 w-3" />
        <span>Offline</span>
      </Badge>
    </div>
  );
}