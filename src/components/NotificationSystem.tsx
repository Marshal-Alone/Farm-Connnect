import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Notification {
    id: string;
    type: 'booking' | 'payment' | 'message' | 'review' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
}

interface NotificationSystemProps {
    userId: string;
}

export default function NotificationSystem({ userId }: NotificationSystemProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch notifications from backend
        fetchNotifications();

        // Set up polling for new notifications
        const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds

        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        const count = notifications.filter(n => !n.read).length;
        setUnreadCount(count);
    }, [notifications]);

    const fetchNotifications = async () => {
        // In a real app, fetch from backend
        // For now, using demo data
        const demoNotifications: Notification[] = [
            {
                id: '1',
                type: 'booking',
                title: 'New Booking Request',
                message: 'You have a new booking request for John Deere Tractor',
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                read: false,
                actionUrl: '/owner/dashboard'
            },
            {
                id: '2',
                type: 'payment',
                title: 'Payment Received',
                message: '₹2,500 received for booking #12345',
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                read: false
            },
            {
                id: '3',
                type: 'message',
                title: 'New Message',
                message: 'Ravi Kumar sent you a message',
                timestamp: new Date(Date.now() - 1000 * 60 * 60),
                read: true
            }
        ];

        setNotifications(demoNotifications);
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const getNotificationIcon = (type: Notification['type']) => {
        const icons = {
            booking: '📅',
            payment: '💰',
            message: '💬',
            review: '⭐',
            system: '🔔'
        };
        return icons[type];
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <Card className="absolute top-12 right-0 w-96 z-50 shadow-lg">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Notifications</h3>
                            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                        </div>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-xs"
                                >
                                    Mark all read
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="h-96">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-secondary/50 cursor-pointer transition-colors ${!notification.read ? 'bg-secondary/30' : ''
                                            }`}
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            if (notification.actionUrl) {
                                                window.location.href = notification.actionUrl;
                                            }
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {formatTimestamp(notification.timestamp)}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-green-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </Card>
            )}
        </div>
    );
}
