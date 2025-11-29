// Test script for Reviews and Messages APIs
const API_BASE = 'http://localhost:4173/api';

// Helper function to make API calls
async function testEndpoint(method, url, body = null, description) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${description}`);
    console.log(`${method} ${url}`);
    console.log('='.repeat(60));

    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
            console.log('Request Body:', JSON.stringify(body, null, 2));
        }

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ SUCCESS');
            return { success: true, data };
        } else {
            console.log('❌ FAILED');
            return { success: false, data };
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('\n🧪 Starting API Tests...\n');

    // First, get a machinery ID to use for testing
    console.log('📋 Getting machinery ID for testing...');
    const machineryResponse = await fetch(`${API_BASE}/machinery?limit=1`);
    const machineryData = await machineryResponse.json();
    const machineryId = machineryData.data[0]._id;
    console.log(`Using machinery ID: ${machineryId}`);

    let reviewId = null;
    let messageId = null;

    // ============================================
    // REVIEWS API TESTS
    // ============================================
    console.log('\n\n🌟 TESTING REVIEWS API');
    console.log('='.repeat(60));

    // Test 1: Submit a review
    const reviewResult = await testEndpoint(
        'POST',
        `${API_BASE}/reviews`,
        {
            machineryId: machineryId,
            reviewerId: 'test_user_123',
            reviewerName: 'Test User',
            overallRating: 5,
            conditionRating: 5,
            performanceRating: 4,
            valueForMoneyRating: 5,
            ownerBehaviorRating: 5,
            title: 'Excellent Tractor!',
            comment: 'This tractor worked perfectly for my farm. Highly recommended!',
            pros: ['Powerful engine', 'Easy to operate', 'Good fuel efficiency'],
            cons: ['A bit expensive']
        },
        'Submit a review'
    );

    if (reviewResult.success) {
        reviewId = reviewResult.data.data._id;
    }

    // Test 2: Get machinery reviews
    await testEndpoint(
        'GET',
        `${API_BASE}/reviews/machinery/${machineryId}`,
        null,
        'Get reviews for machinery'
    );

    // Test 3: Mark review as helpful
    if (reviewId) {
        await testEndpoint(
            'POST',
            `${API_BASE}/reviews/${reviewId}/helpful`,
            { userId: 'another_user_456' },
            'Mark review as helpful'
        );
    }

    // Test 4: Add owner response
    if (reviewId) {
        await testEndpoint(
            'POST',
            `${API_BASE}/reviews/${reviewId}/response`,
            {
                comment: 'Thank you for your feedback! Glad you enjoyed using the tractor.',
                ownerId: 'user123'
            },
            'Add owner response to review'
        );
    }

    // Test 5: Update review
    if (reviewId) {
        await testEndpoint(
            'PUT',
            `${API_BASE}/reviews/${reviewId}`,
            {
                comment: 'Updated: This tractor worked perfectly for my farm. Highly recommended! Used it for 3 days.',
                overallRating: 5
            },
            'Update review'
        );
    }

    // ============================================
    // MESSAGES API TESTS
    // ============================================
    console.log('\n\n💬 TESTING MESSAGES API');
    console.log('='.repeat(60));

    // Test 1: Send a message
    const messageResult = await testEndpoint(
        'POST',
        `${API_BASE}/messages`,
        {
            senderId: 'user123',
            senderName: 'Rajesh Kumar',
            receiverId: 'user456',
            receiverName: 'Suresh Patel',
            content: 'Hi, I am interested in renting your tractor. Is it available next week?',
            messageType: 'text'
        },
        'Send a message'
    );

    if (messageResult.success) {
        messageId = messageResult.data.data._id;
    }

    // Test 2: Send another message
    await testEndpoint(
        'POST',
        `${API_BASE}/messages`,
        {
            senderId: 'user456',
            senderName: 'Suresh Patel',
            receiverId: 'user123',
            receiverName: 'Rajesh Kumar',
            content: 'Yes, it is available! When do you need it?',
            messageType: 'text'
        },
        'Send reply message'
    );

    // Test 3: Get conversation
    await testEndpoint(
        'GET',
        `${API_BASE}/messages/conversation/user123/user456`,
        null,
        'Get conversation between two users'
    );

    // Test 4: Get all conversations for a user
    await testEndpoint(
        'GET',
        `${API_BASE}/messages/conversations/user123`,
        null,
        'Get all conversations for user'
    );

    // Test 5: Mark message as read
    if (messageId) {
        await testEndpoint(
            'PUT',
            `${API_BASE}/messages/${messageId}/read`,
            { userId: 'user456' },
            'Mark message as read'
        );
    }

    // Test 6: Mark all messages in conversation as read
    await testEndpoint(
        'PUT',
        `${API_BASE}/messages/conversation/conv-user123-user456/read-all`,
        { userId: 'user456' },
        'Mark all messages as read'
    );

    // ============================================
    // CLEANUP (Optional - Delete test data)
    // ============================================
    console.log('\n\n🧹 CLEANUP (Optional)');
    console.log('='.repeat(60));

    // Delete review
    if (reviewId) {
        await testEndpoint(
            'DELETE',
            `${API_BASE}/reviews/${reviewId}`,
            null,
            'Delete test review'
        );
    }

    // Delete message
    if (messageId) {
        await testEndpoint(
            'DELETE',
            `${API_BASE}/messages/${messageId}`,
            { userId: 'user123' },
            'Delete test message'
        );
    }

    console.log('\n\n🎉 All tests completed!\n');
}

// Run the tests
runTests().catch(console.error);
