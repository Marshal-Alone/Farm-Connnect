import { MessageSchema, ConversationSchema } from '../schemas/message.schema';

const API_BASE_URL = '/api';

export interface SendMessageData {
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    content: string;
    messageType?: 'text' | 'image' | 'file' | 'booking-request' | 'system';
    attachments?: {
        type: 'image' | 'file';
        url: string;
        name: string;
        size: number;
    }[];
    relatedBookingId?: string;
    relatedMachineryId?: string;
}

export interface MessageResponse {
    success: boolean;
    data: MessageSchema[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    error?: string;
}

export interface SingleMessageResponse {
    success: boolean;
    data: MessageSchema;
    error?: string;
}

export interface ConversationResponse {
    success: boolean;
    data: ConversationSchema[];
    error?: string;
}

class MessageService {
    // Send a message
    async sendMessage(messageData: SendMessageData): Promise<SingleMessageResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            return {
                success: false,
                data: {} as MessageSchema,
                error: 'Failed to send message'
            };
        }
    }

    // Get conversation messages
    async getConversation(userId: string, otherUserId: string, page: number = 1, limit: number = 50): Promise<MessageResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            const response = await fetch(`${API_BASE_URL}/messages/conversation/${userId}/${otherUserId}?${queryParams}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching conversation:', error);
            return {
                success: false,
                data: [],
                error: 'Failed to fetch conversation'
            };
        }
    }

    // Get all conversations for user
    async getUserConversations(userId: string): Promise<ConversationResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/conversations/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching conversations:', error);
            return {
                success: false,
                data: [],
                error: 'Failed to fetch conversations'
            };
        }
    }

    // Mark message as read
    async markAsRead(messageId: string, userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error marking message as read:', error);
            return {
                success: false,
                error: 'Failed to mark message as read'
            };
        }
    }

    // Mark all messages in conversation as read
    async markAllAsRead(conversationId: string, userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/conversation/${conversationId}/read-all`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error marking all messages as read:', error);
            return {
                success: false,
                error: 'Failed to mark all messages as read'
            };
        }
    }

    // Delete message
    async deleteMessage(messageId: string, userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting message:', error);
            return {
                success: false,
                error: 'Failed to delete message'
            };
        }
    }
}

export const messageService = new MessageService();
