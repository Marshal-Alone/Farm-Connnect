import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { messageService } from '@/lib/api/messageService';
import { ConversationSchema, MessageSchema } from '@/lib/schemas/message.schema';
import { format } from 'date-fns';

interface MessagingPanelProps {
    userId: string;
    userName: string;
}

export default function MessagingPanel({ userId, userName }: MessagingPanelProps) {
    const [conversations, setConversations] = useState<ConversationSchema[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageSchema[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchConversations();
    }, [userId]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const response = await messageService.getUserConversations(userId);
            if (response.success) {
                setConversations(response.data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId: string) => {
        const conv = conversations.find(c => c._id === conversationId);
        if (!conv) return;

        const otherUserId = conv.participants.find(p => p !== userId);
        if (!otherUserId) return;

        try {
            const response = await messageService.getConversation(userId, otherUserId);
            if (response.success) {
                setMessages(response.data);

                // Mark messages as read
                response.data.forEach(msg => {
                    if (msg.receiverId === userId && !msg.isRead) {
                        messageService.markAsRead(msg._id!, userId);
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const conv = conversations.find(c => c._id === selectedConversation);
        if (!conv) return;

        const receiverId = conv.participants.find(p => p !== userId);
        if (!receiverId) return;

        setSending(true);
        try {
            const response = await messageService.sendMessage({
                senderId: userId,
                senderName: userName,
                receiverId,
                receiverName: conv.participantNames[receiverId] || 'User',
                content: newMessage,
                messageType: 'text'
            });

            if (response.success) {
                setNewMessage('');
                fetchMessages(selectedConversation);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to send message",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive"
            });
        } finally {
            setSending(false);
        }
    };

    const getOtherUserName = (conv: ConversationSchema) => {
        const otherUserId = conv.participants.find(p => p !== userId);
        return otherUserId ? conv.participantNames[otherUserId] : 'Unknown';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
            {/* Conversations List */}
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Messages
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv._id}
                                    onClick={() => setSelectedConversation(conv._id!)}
                                    className={`p-4 border-b cursor-pointer hover:bg-secondary/50 transition-colors ${selectedConversation === conv._id ? 'bg-secondary' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getOtherUserName(conv).charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-sm truncate">
                                                    {getOtherUserName(conv)}
                                                </p>
                                                {conv.unreadCount > 0 && (
                                                    <Badge className="bg-green-600 text-white">
                                                        {conv.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {conv.lastMessage?.content || 'No messages yet'}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {conv.lastMessage && format(new Date(conv.lastMessage.createdAt), 'MMM dd, HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Messages */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>
                        {selectedConversation
                            ? getOtherUserName(conversations.find(c => c._id === selectedConversation)!)
                            : 'Select a conversation'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {selectedConversation ? (
                        <>
                            <ScrollArea className="h-[400px] p-4">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-muted-foreground">No messages yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg._id}
                                                className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${msg.senderId === userId
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-secondary'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${msg.senderId === userId ? 'text-green-100' : 'text-muted-foreground'
                                                        }`}>
                                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>

                            {/* Message Input */}
                            <div className="p-4 border-t">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        disabled={sending}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() || sending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {sending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-[500px]">
                            <div className="text-center">
                                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
