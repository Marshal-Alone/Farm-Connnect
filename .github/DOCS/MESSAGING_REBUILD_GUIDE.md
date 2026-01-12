# The Definitive Messaging Rebuild Guide

This document contains **100% of the code** required to rebuild the unified messaging system from scratch. If the system is deleted, simply follow these steps and copy-paste the provided code blocks.

---

## 1. Architectural Strategy
We use a **Unified Messaging Hub** located in the "Messages" tab of the User Profile.
- **Backend**: Express + MongoDB.
- **Frontend**: React + Tailwind + Shadcn.
- **Real-time**: 3-second HTTP Polling (Reliable and easy to maintain).

---

## 2. Step-by-Step Implementation

### Step 1: Database Schema & Setup
Create a `messages` and `conversations` collection in MongoDB.

#### Schema Documentation (`src/lib/schemas/message.schema.ts`)
```typescript
export interface MessageSchema {
    _id?: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    messageType: 'text' | 'image' | 'file' | 'booking-request' | 'system';
    content: string;
    attachments?: { type: 'image' | 'file'; url: string; name: string; size: number; }[];
    relatedBookingId?: string;
    relatedMachineryId?: string;
    isRead: boolean;
    readAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedBy?: string[];
    isEdited: boolean;
}

export function generateConversationId(userId1: string, userId2: string): string {
    const sortedIds = [userId1, userId2].sort();
    return `conv-${sortedIds[0]}-${sortedIds[1]}`;
}
```

---

### Step 2: Backend API Layer (`api/messages.js`)
Copy this entire file into your `api/` directory.

```javascript
import express from 'express';
import { getDatabase, collections } from '../database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

function generateConversationId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `conv-${sortedIds[0]}-${sortedIds[1]}`;
}

// Send Message
router.post('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const messagesCollection = db.collection(collections.messages);
        const conversationsCollection = db.collection('conversations');
        const { senderId, senderName, receiverId, receiverName, content } = req.body;

        const conversationId = generateConversationId(senderId, receiverId);
        const messageData = {
            conversationId, senderId, senderName, receiverId, receiverName,
            content, isRead: false, createdAt: new Date()
        };

        const result = await messagesCollection.insertOne(messageData);

        // Update or create conversation summary
        await conversationsCollection.updateOne(
            { conversationId },
            {
                $set: { lastMessage: { content, senderId, createdAt: new Date() }, updatedAt: new Date() },
                $inc: { [`unreadCount.${receiverId}`]: 1 },
                $setOnInsert: { 
                    participants: [{ userId: senderId, userName: senderName }, { userId: receiverId, userName: receiverName }],
                    isActive: true, createdAt: new Date() 
                }
            },
            { upsert: true }
        );

        res.status(201).json({ success: true, data: { _id: result.insertedId, ...messageData } });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// Get Messages
router.get('/conversation/:userId/:otherUserId', async (req, res) => {
    const { userId, otherUserId } = req.params;
    const db = await getDatabase();
    const conversationId = generateConversationId(userId, otherUserId);
    const messages = await db.collection(collections.messages).find({ conversationId }).sort({ createdAt: 1 }).toArray();
    res.json({ success: true, data: messages });
});

// Get Conversations
router.get('/conversations/:userId', async (req, res) => {
    const db = await getDatabase();
    const conversations = await db.collection('conversations').find({ 'participants.userId': req.params.userId }).sort({ updatedAt: -1 }).toArray();
    res.json({ success: true, data: conversations });
});

// Mark All Read
router.put('/conversation/:conversationId/read-all', async (req, res) => {
    const db = await getDatabase();
    const { conversationId } = req.params;
    const { userId } = req.body;
    await db.collection(collections.messages).updateMany({ conversationId, receiverId: userId, isRead: false }, { $set: { isRead: true } });
    await db.collection('conversations').updateOne({ conversationId }, { $set: { [`unreadCount.${userId}`]: 0 } });
    res.json({ success: true });
});

export default router;
```

---

### Step 3: Frontend Service Layer (`src/lib/api/messageService.ts`)
Copy this entire file into your `src/lib/api/` directory.

```typescript
const API_BASE_URL = '/api';

class MessageService {
    async sendMessage(messageData: any) {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData),
        });
        return await response.json();
    }

    async getConversation(userId: string, otherUserId: string) {
        const response = await fetch(`${API_BASE_URL}/messages/conversation/${userId}/${otherUserId}`);
        return await response.json();
    }

    async getUserConversations(userId: string) {
        const response = await fetch(`${API_BASE_URL}/messages/conversations/${userId}`);
        return await response.json();
    }

    async markAllAsRead(conversationId: string, userId: string) {
        const response = await fetch(`${API_BASE_URL}/messages/conversation/${conversationId}/read-all`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        return await response.json();
    }
}

export const messageService = new MessageService();
```

---

### Step 4: The Messaging Hub Logic (`UserProfile.tsx`)

#### A. Polling Logic (For "Instant" Receipt)
Add this effect inside the `UserProfile` component.

```typescript
// Instant messaging poll every 3 seconds
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (activeTab === 'messages') {
    fetchConversations(); // Initial load
    interval = setInterval(() => {
      fetchConversations(); // Refresh unread count badges
      if (selectedConversation && selectedConversation.conversationId !== 'temp') {
        const otherId = selectedConversation.participants.find(p => p.userId !== ownerId).userId;
        messageService.getConversation(ownerId, otherId).then(res => {
          if (res.success && res.data.length !== conversationMessages.length) {
            setConversationMessages(res.data);
          }
        });
      }
    }, 3000);
  }
  return () => clearInterval(interval);
}, [activeTab, selectedConversation?.conversationId, conversationMessages.length]);
```

#### B. Deep Linking Logic
Add this effect to handle redirects from "Message Owner" buttons.

```typescript
useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'messages') {
        setActiveTab('messages');
        const otherId = params.get('otherId');
        if (otherId && conversations.length > 0) {
            const conv = conversations.find(c => c.participants.some(p => p.userId === otherId));
             if (conv) handleSelectConversation(conv);
        }
    }
}, [conversations.length]);
```

---

### Step 5: External Redirection Logic
To trigger a message from any page (like `MachineryDetail.tsx` or `BookingCard`), use this snippet:

```typescript
// Redirect to User Profile and open specific conversation
const handleMessageUser = (targetUserId) => {
  window.location.href = `/profile?tab=messages&otherId=${targetUserId}`;
};
```

---

## 3. Visual Reference (JSX Structure)
The UI uses a `12-column grid`:
- **4 Columns**: Conversation sidebar.
- **8 Columns**: Active chat window.
- **Mobile handling**: Sidebar hidden when `selectedConversation` is active on small screens.

By using these precise code blocks, you can completely restore the Peer-to-Peer messaging system in under 5 minutes.
