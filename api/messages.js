import express from 'express';
import { getDatabase, collections } from '../database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Helper function to generate conversation ID
function generateConversationId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `conv-${sortedIds[0]}-${sortedIds[1]}`;
}

// POST /api/messages - Send a message
router.post('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const messagesCollection = db.collection(collections.messages);
        const conversationsCollection = db.collection('conversations');

        const {
            senderId,
            senderName,
            receiverId,
            receiverName,
            content,
            messageType = 'text',
            attachments,
            relatedBookingId,
            relatedMachineryId
        } = req.body;

        if (!senderId || !receiverId || !content) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const conversationId = generateConversationId(senderId, receiverId);

        // Create message
        const messageData = {
            conversationId,
            senderId,
            senderName,
            receiverId,
            receiverName,
            messageType,
            content,
            attachments: attachments || [],
            relatedBookingId: relatedBookingId || null,
            relatedMachineryId: relatedMachineryId || null,
            isRead: false,
            isDelivered: true,
            deliveredAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedBy: [],
            isEdited: false
        };

        const result = await messagesCollection.insertOne(messageData);

        // Update or create conversation
        const conversation = await conversationsCollection.findOne({ conversationId });

        if (conversation) {
            // Update existing conversation
            await conversationsCollection.updateOne(
                { conversationId },
                {
                    $set: {
                        lastMessage: {
                            content,
                            senderId,
                            createdAt: new Date()
                        },
                        updatedAt: new Date()
                    },
                    $inc: {
                        [`unreadCount.${receiverId}`]: 1
                    }
                }
            );
        } else {
            // Create new conversation
            await conversationsCollection.insertOne({
                conversationId,
                participants: [
                    { userId: senderId, userName: senderName },
                    { userId: receiverId, userName: receiverName }
                ],
                lastMessage: {
                    content,
                    senderId,
                    createdAt: new Date()
                },
                unreadCount: {
                    [senderId]: 0,
                    [receiverId]: 1
                },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        res.status(201).json({
            success: true,
            data: {
                _id: result.insertedId,
                ...messageData
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// GET /api/messages/conversation/:userId/:otherUserId - Get conversation messages
router.get('/conversation/:userId/:otherUserId', async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const db = await getDatabase();
        const messagesCollection = db.collection(collections.messages);

        const conversationId = generateConversationId(userId, otherUserId);

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const messages = await messagesCollection
            .find({
                conversationId,
                deletedBy: { $ne: userId }
            })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        const total = await messagesCollection.countDocuments({
            conversationId,
            deletedBy: { $ne: userId }
        });

        res.json({
            success: true,
            data: messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});

// GET /api/messages/conversations/:userId - Get all conversations for user
router.get('/conversations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = await getDatabase();
        const conversationsCollection = db.collection('conversations');

        const conversations = await conversationsCollection
            .find({
                'participants.userId': userId,
                isActive: true
            })
            .sort({ updatedAt: -1 })
            .toArray();

        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
    }
});

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const db = await getDatabase();
        const messagesCollection = db.collection(collections.messages);
        const conversationsCollection = db.collection('conversations');

        const message = await messagesCollection.findOne({ _id: new ObjectId(id) });

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        // Only receiver can mark as read
        if (message.receiverId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        await messagesCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    isRead: true,
                    readAt: new Date()
                }
            }
        );

        // Update conversation unread count
        await conversationsCollection.updateOne(
            { conversationId: message.conversationId },
            {
                $set: {
                    [`unreadCount.${userId}`]: 0,
                    [`participants.$[elem].lastReadAt`]: new Date()
                }
            },
            {
                arrayFilters: [{ 'elem.userId': userId }]
            }
        );

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark message as read' });
    }
});

// PUT /api/messages/conversation/:conversationId/read-all - Mark all messages as read
router.put('/conversation/:conversationId/read-all', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { userId } = req.body;

        const db = await getDatabase();
        const messagesCollection = db.collection(collections.messages);
        const conversationsCollection = db.collection('conversations');

        // Mark all unread messages as read
        await messagesCollection.updateMany(
            {
                conversationId,
                receiverId: userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date()
                }
            }
        );

        // Reset unread count
        await conversationsCollection.updateOne(
            { conversationId },
            {
                $set: {
                    [`unreadCount.${userId}`]: 0
                }
            }
        );

        res.json({
            success: true,
            message: 'All messages marked as read'
        });
    } catch (error) {
        console.error('Error marking all messages as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark all messages as read' });
    }
});

// DELETE /api/messages/:id - Delete message (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const db = await getDatabase();
        const messagesCollection = db.collection(collections.messages);

        await messagesCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $addToSet: { deletedBy: userId }
            }
        );

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ success: false, error: 'Failed to delete message' });
    }
});

export default router;
