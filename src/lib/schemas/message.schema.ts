export interface MessageSchema {
    _id?: string;
    conversationId: string; // Unique ID for conversation between two users
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;

    // Message content
    messageType: 'text' | 'image' | 'file' | 'booking-request' | 'system';
    content: string;

    // Attachments
    attachments?: {
        type: 'image' | 'file';
        url: string;
        name: string;
        size: number;
    }[];

    // Booking context (if related to a booking)
    relatedBookingId?: string;
    relatedMachineryId?: string;

    // Status
    isRead: boolean;
    readAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    deletedBy?: string[]; // User IDs who deleted this message
    isEdited: boolean;
    editedAt?: Date;
}

export interface ConversationSchema {
    _id?: string;
    conversationId: string;
    participants: {
        userId: string;
        userName: string;
        lastReadAt?: Date;
    }[];

    // Last message info
    lastMessage: {
        content: string;
        senderId: string;
        createdAt: Date;
    };

    // Metadata
    unreadCount: {
        [userId: string]: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Helper function to generate conversation ID
export function generateConversationId(userId1: string, userId2: string): string {
    // Sort user IDs to ensure consistent conversation ID regardless of order
    const sortedIds = [userId1, userId2].sort();
    return `conv-${sortedIds[0]}-${sortedIds[1]}`;
}

// Helper function to check if user is participant
export function isParticipant(conversation: ConversationSchema, userId: string): boolean {
    return conversation.participants.some(p => p.userId === userId);
}
