# Farm Connect API Testing Guide

Complete testing guide for all Farm Connect API endpoints with logging enabled.

---

## Prerequisites

**Start both servers before testing:**

```bash
# Terminal 1: Start Backend (port 4174)
PORT=4174 node server.js

# Terminal 2: Start Frontend (port 8080)
npm run dev
```

Each endpoint will now log:
- 📋 **Request Received**: When API is hit (includes parameters)
- ✅ **Success**: When execution completes successfully
- ❌ **Failed**: When execution fails (if implemented)

---

## Authentication Endpoints

### 1. POST /api/auth/register - Register New User

**Description**: Create a new user account

**Request Body**:
```json
{
  "name": "Farmer Name",
  "email": "farmer@example.com",
  "password": "SecurePass123!",
  "phone": "+91 9876543210",
  "location": "Maharashtra",
  "language": "hindi",
  "farmSize": 5,
  "crops": ["rice", "wheat"]
}
```

**Test with cURL**:
```bash
curl -X POST http://localhost:4174/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh'$(date +%s)'@test.com",
    "password": "Pass123!",
    "phone": "+919876543210",
    "location": "Pune, Maharashtra",
    "language": "hindi",
    "farmSize": 10,
    "crops": ["rice", "sugarcane"]
  }'
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');
axios.post('http://localhost:4174/api/auth/register', {
  name: 'TestUser ' + Date.now(),
  email: 'test' + Date.now() + '@example.com',
  password: 'Pass123!',
  phone: '+91' + Math.floor(Math.random() * 10000000000),
  farmSize: 5,
  crops: ['rice']
}).then(res => console.log('✅ Response:', res.data))
  .catch(err => console.log('❌ Error:', err.response?.data || err.message));
"
```

**Expected Console Logs**:
```
📋 [POST /api/auth/register] Request received { email: 'rajesh@test.com', name: 'Rajesh Kumar', timestamp: '2025-01-26T10:30:45.123Z' }
✅ [POST /api/auth/register] Success { userId: '507f1f77bcf86cd799439011', email: 'rajesh@test.com', timestamp: '2025-01-26T10:30:46.456Z' }
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Rajesh Kumar",
      "email": "rajesh@test.com",
      "phone": "+919876543210",
      "farmSize": 10,
      "crops": ["rice", "sugarcane"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. POST /api/auth/login - User Authentication

**Description**: Login with email/phone and password

**Request Body**:
```json
{
  "identifier": "rajesh@test.com",
  "password": "Pass123!"
}
```

**Test with cURL**:
```bash
curl -X POST http://localhost:4174/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "rajesh@test.com",
    "password": "Pass123!"
  }'
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');
axios.post('http://localhost:4174/api/auth/login', {
  identifier: 'rajesh@test.com',
  password: 'Pass123!'
}).then(res => {
  console.log('✅ Logged in:', res.data.data.user.name);
  console.log('Token:', res.data.data.token.substring(0, 20) + '...');
}).catch(err => console.log('❌ Error:', err.response?.data?.error));
"
```

**Expected Console Logs**:
```
📋 [POST /api/auth/login] Request received { identifier: 'rajesh@test.com', timestamp: '2025-01-26T10:35:10.123Z' }
✅ [POST /api/auth/login] Success { userId: '507f1f77bcf86cd799439011', email: 'rajesh@test.com', timestamp: '2025-01-26T10:35:11.456Z' }
```

---

### 3. GET /api/auth/me - Get Current Logged-in User

**Description**: Retrieve current user info (requires authentication)

**Headers Required**:
```
Authorization: Bearer {JWT_TOKEN}
```

**Test with cURL**:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:4174/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');
const token = 'YOUR_JWT_TOKEN_HERE';

axios.get('http://localhost:4174/api/auth/me', {
  headers: { 'Authorization': 'Bearer ' + token }
}).then(res => console.log('✅ User:', res.data.data.name))
  .catch(err => console.log('❌ Error:', err.response?.data?.error));
"
```

**Expected Console Logs**:
```
📋 [GET /api/auth/me] Request received { timestamp: '2025-01-26T10:40:15.123Z' }
✅ [GET /api/auth/me] Success { userId: '507f1f77bcf86cd799439011', email: 'rajesh@test.com', timestamp: '2025-01-26T10:40:16.456Z' }
```

---

## User Profile Endpoints

### 4. PUT /api/users/:id - Update User Profile

**Description**: Update user information (farmSize, crops, language, location)

**Request Body**:
```json
{
  "farmSize": 15,
  "crops": ["rice", "wheat", "sugarcane"],
  "language": "marathi",
  "location": "Nagpur"
}
```

**Test with cURL**:
```bash
USER_ID="507f1f77bcf86cd799439011"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PUT http://localhost:4174/api/users/$USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "farmSize": 20,
    "crops": ["rice", "wheat"],
    "language": "english"
  }'
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

async function test() {
  try {
    // First register/login to get token and userId
    const loginRes = await axios.post('http://localhost:4174/api/auth/register', {
      name: 'UpdateTest ' + Date.now(),
      email: 'update' + Date.now() + '@test.com',
      password: 'Pass123!',
      phone: '+91' + Math.floor(Math.random() * 10000000000)
    });

    const token = loginRes.data.data.token;
    const userId = loginRes.data.data.user._id;

    // Now update the profile
    const updateRes = await axios.put('http://localhost:4174/api/users/' + userId,
      { farmSize: 25, crops: ['rice', 'sugarcane'] },
      { headers: { 'Authorization': 'Bearer ' + token } }
    );

    console.log('✅ Updated:', updateRes.data.message);
  } catch (err) {
    console.log('❌ Error:', err.response?.data?.error || err.message);
  }
  process.exit(0);
}
test();
"
```

**Expected Console Logs**:
```
📋 [PUT /api/users/:id] Request received { userId: '507f1f77bcf86cd799439011', updates: { farmSize: 20, crops: [ 'rice', 'wheat' ] }, timestamp: '2025-01-26T10:45:30.123Z' }
✅ [PUT /api/users/:id] Success { userId: '507f1f77bcf86cd799439011', modifiedCount: 1, timestamp: '2025-01-26T10:45:31.456Z' }
```

---

## Machinery Endpoints

### 5. GET /api/machinery - List All Machinery with Filters

**Description**: Get all available machinery with filtering options

**Query Parameters**:
- `type`: machinery type (tractor, harvester, rotavator, seeder, sprayer, etc.)
- `location`: state/location name
- `minPrice` / `maxPrice`: price range per day
- `minRating`: minimum rating (0-5)
- `available`: filter by availability (true/false)
- `search`: search by name, description, or brand
- `sortBy`: field to sort by (default: createdAt)
- `sortOrder`: asc or desc (default: desc)
- `page`: pagination page (default: 1)
- `limit`: results per page (default: 12)

**Test with cURL**:
```bash
# Get all machinery
curl "http://localhost:4174/api/machinery"

# With filters
curl "http://localhost:4174/api/machinery?type=tractor&location=Maharashtra&minPrice=1000&maxPrice=5000&available=true"

# Search and pagination
curl "http://localhost:4174/api/machinery?search=John%20Deere&page=1&limit=5"
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');
axios.get('http://localhost:4174/api/machinery', {
  params: {
    type: 'tractor',
    location: 'Maharashtra',
    available: 'true',
    limit: 10
  }
}).then(res => {
  console.log('✅ Found:', res.data.data.length, 'machinery');
  console.log('Total:', res.data.pagination.total);
  if (res.data.data.length > 0) {
    console.log('First item:', res.data.data[0].name);
  }
}).catch(err => console.log('❌ Error:', err.response?.data?.error || err.message));
"
```

**Expected Console Logs**:
```
📋 [GET /api/machinery] Request received { filters: { type: 'tractor', location: 'Maharashtra', available: 'true' }, timestamp: '2025-01-26T11:00:00.123Z' }
✅ [GET /api/machinery] Success { returned: 8, total: 52, page: 1, timestamp: '2025-01-26T11:00:01.456Z' }
```

---

### 6. GET /api/machinery/:id - Get Machinery Details

**Description**: Get detailed information about a specific machinery item

**Test with cURL**:
```bash
MACHINERY_ID="507f1f77bcf86cd799439011"
curl "http://localhost:4174/api/machinery/$MACHINERY_ID"
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

// First get a list to get a machinery ID
axios.get('http://localhost:4174/api/machinery?limit=1')
  .then(res => {
    if (res.data.data.length === 0) {
      console.log('❌ No machinery found. Please seed the database first.');
      process.exit(0);
    }
    return res.data.data[0]._id;
  })
  .then(id => axios.get('http://localhost:4174/api/machinery/' + id))
  .then(res => {
    console.log('✅ Machinery Details:');
    console.log('  Name:', res.data.data.name);
    console.log('  Price:', res.data.data.pricePerDay, '/day');
    console.log('  Rating:', res.data.data.rating, '⭐');
  })
  .catch(err => console.log('❌ Error:', err.response?.data?.error || err.message));
"
```

**Expected Console Logs**:
```
📋 [GET /api/machinery/:id] Request received { machineryId: '507f1f77bcf86cd799439011', timestamp: '2025-01-26T11:05:20.123Z' }
✅ [GET /api/machinery/:id] Success { machineryId: '507f1f77bcf86cd799439011', name: 'John Deere 5075E Tractor', timestamp: '2025-01-26T11:05:21.456Z' }
```

---

### 7. POST /api/machinery - Add New Machinery

**Description**: Create a new machinery listing (owner only)

**Request Body**:
```json
{
  "name": "John Deere 5050D",
  "type": "tractor",
  "ownerId": "507f1f77bcf86cd799439011",
  "ownerName": "Rajesh Kumar",
  "ownerPhone": "+919876543210",
  "ownerEmail": "rajesh@example.com",
  "location": {
    "address": "Farm Road, Sector 12",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411001"
  },
  "pricePerDay": 2500,
  "description": "Well-maintained John Deere tractor",
  "condition": "excellent",
  "images": ["https://example.com/image1.jpg"],
  "specifications": [
    { "key": "Engine", "value": "3.2L Diesel" },
    { "key": "Power", "value": "50 HP" }
  ],
  "features": ["Power Steering", "Hydraulic Lift"],
  "securityDeposit": 5000
}
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

async function test() {
  try {
    // Register owner first
    const registerRes = await axios.post('http://localhost:4174/api/auth/register', {
      name: 'Owner ' + Date.now(),
      email: 'owner' + Date.now() + '@test.com',
      password: 'Pass123!',
      phone: '+91' + Math.floor(Math.random() * 10000000000)
    });

    const ownerId = registerRes.data.data.user._id;
    const token = registerRes.data.data.token;

    // Create machinery
    const macRes = await axios.post('http://localhost:4174/api/machinery', {
      name: 'Test Tractor ' + Date.now(),
      type: 'tractor',
      ownerId: ownerId,
      ownerName: registerRes.data.data.user.name,
      ownerPhone: registerRes.data.data.user.phone,
      ownerEmail: registerRes.data.data.user.email,
      location: {
        address: 'Test Farm',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001'
      },
      pricePerDay: 2000,
      description: 'Test machinery',
      condition: 'good',
      images: [],
      specifications: [],
      features: [],
      securityDeposit: 5000
    }, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    console.log('✅ Machinery created:', macRes.data.data._id);
  } catch (err) {
    console.log('❌ Error:', err.response?.data?.error || err.message);
  }
  process.exit(0);
}
test();
"
```

**Expected Console Logs**:
```
📋 [POST /api/machinery] Request received { ownerId: '507f1f77bcf86cd799439011', name: 'John Deere 5050D', timestamp: '2025-01-26T11:10:45.123Z' }
✅ [POST /api/machinery] Success { machineryId: '507f2f77bcf86cd799439012', name: 'John Deere 5050D', timestamp: '2025-01-26T11:10:46.456Z' }
```

---

### 8. PUT /api/machinery/:id - Update Machinery

**Description**: Update existing machinery details

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

async function test() {
  try {
    // Get first machinery
    const getRes = await axios.get('http://localhost:4174/api/machinery?limit=1');
    if (getRes.data.data.length === 0) {
      console.log('❌ No machinery found');
      process.exit(0);
    }

    const machId = getRes.data.data[0]._id;

    // Update it
    const updateRes = await axios.put('http://localhost:4174/api/machinery/' + machId, {
      pricePerDay: 3000,
      available: true,
      condition: 'excellent'
    });

    console.log('✅ Updated:', updateRes.data.message);
  } catch (err) {
    console.log('❌ Error:', err.response?.data?.error || err.message);
  }
  process.exit(0);
}
test();
"
```

**Expected Console Logs**:
```
📋 [PUT /api/machinery/:id] Request received { machineryId: '507f2f77bcf86cd799439012', updates: ['pricePerDay', 'available', 'condition'], timestamp: '2025-01-26T11:15:10.123Z' }
✅ [PUT /api/machinery/:id] Success { machineryId: '507f2f77bcf86cd799439012', modifiedCount: 1, timestamp: '2025-01-26T11:15:11.456Z' }
```

---

### 9. DELETE /api/machinery/:id - Delete Machinery (Soft Delete)

**Description**: Remove machinery from listing (soft delete)

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

async function test() {
  try {
    const getRes = await axios.get('http://localhost:4174/api/machinery?limit=1');
    if (getRes.data.data.length === 0) {
      console.log('❌ No machinery found');
      process.exit(0);
    }

    const machId = getRes.data.data[0]._id;
    const deleteRes = await axios.delete('http://localhost:4174/api/machinery/' + machId);
    console.log('✅ Deleted:', deleteRes.data.message);
  } catch (err) {
    console.log('❌ Error:', err.response?.data?.error || err.message);
  }
  process.exit(0);
}
test();
"
```

**Expected Console Logs**:
```
📋 [DELETE /api/machinery/:id] Request received { machineryId: '507f2f77bcf86cd799439012', timestamp: '2025-01-26T11:20:25.123Z' }
✅ [DELETE /api/machinery/:id] Success { machineryId: '507f2f77bcf86cd799439012', modifiedCount: 1, timestamp: '2025-01-26T11:20:26.456Z' }
```

---

## Bookings Endpoints

### 10. POST /api/bookings - Create New Booking

**Description**: Create a rental booking for machinery

**Request Body**:
```json
{
  "machineryId": "507f1f77bcf86cd799439011",
  "renterId": "507f1f77bcf86cd799439012",
  "renterName": "Farmer Name",
  "renterPhone": "+919876543210",
  "renterEmail": "farmer@example.com",
  "startDate": "2025-02-01T00:00:00Z",
  "endDate": "2025-02-05T00:00:00Z",
  "deliveryRequired": false,
  "purpose": "Field preparation",
  "paymentMode": "demo"
}
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

async function test() {
  try {
    // Get a machinery
    const macRes = await axios.get('http://localhost:4174/api/machinery?limit=1');
    if (macRes.data.data.length === 0) {
      console.log('❌ No machinery found. Seed database first.');
      process.exit(0);
    }
    
    const machineryId = macRes.data.data[0]._id;

    // Register renter
    const userRes = await axios.post('http://localhost:4174/api/auth/register', {
      name: 'Renter ' + Date.now(),
      email: 'renter' + Date.now() + '@test.com',
      password: 'Pass123!',
      phone: '+91' + Math.floor(Math.random() * 10000000000)
    });

    const renterId = userRes.data.data.user._id;
    const renterName = userRes.data.data.user.name;

    // Create booking
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endDate = new Date(tomorrow);
    endDate.setDate(endDate.getDate() + 3);

    const bookingRes = await axios.post('http://localhost:4174/api/bookings', {
      machineryId: machineryId,
      renterId: renterId,
      renterName: renterName,
      renterPhone: userRes.data.data.user.phone,
      renterEmail: userRes.data.data.user.email,
      startDate: tomorrow.toISOString(),
      endDate: endDate.toISOString(),
      deliveryRequired: false,
      purpose: 'Testing',
      paymentMode: 'demo'
    });

    console.log('✅ Booking created:', bookingRes.data.data.bookingNumber);
  } catch (err) {
    console.log('❌ Error:', err.response?.data?.error || err.message);
  }
  process.exit(0);
}
test();
"
```

**Expected Console Logs**:
```
📋 [POST /api/bookings] Request received { machineryId: '507f1f77bcf86cd799439011', renterId: '507f1f77bcf86cd799439012', startDate: '2025-02-01T00:00:00Z', endDate: '2025-02-05T00:00:00Z', timestamp: '2025-01-26T11:25:40.123Z' }
✅ [POST /api/bookings] Success { bookingId: '607g2g88bcf86cd799439013', bookingNumber: 'BK-abc123-def45', machineryId: '507f1f77bcf86cd799439011', renterId: '507f1f77bcf86cd799439012', finalAmount: 10000, timestamp: '2025-01-26T11:25:41.456Z' }
```

---

### 11. GET /api/bookings - Get All Bookings

**Test with cURL**:
```bash
curl "http://localhost:4174/api/bookings"
```

**Expected Console Logs**:
```
📋 [GET /api/bookings] Request received { filters: {}, timestamp: '2025-01-26T11:30:15.123Z' }
```

---

### 12. GET /api/bookings/user/:userId - Get User's Bookings

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

// First create a user and booking, then fetch
axios.get('http://localhost:4174/api/bookings/user/507f1f77bcf86cd799439012')
  .then(res => console.log('✅ Bookings:', res.data.data.length))
  .catch(err => console.log('❌ Error:', err.response?.data?.error));
"
```

**Expected Console Logs**:
```
📋 [GET /api/bookings/user/:userId] Request received { userId: '507f1f77bcf86cd799439012', timestamp: '2025-01-26T11:35:30.123Z' }
```

---

### 13. PUT /api/bookings/:id/status - Update Booking Status

**Description**: Change booking status (pending → confirmed → in-progress → completed)

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

// Get a booking first
axios.get('http://localhost:4174/api/bookings')
  .then(res => {
    if (res.data.data.length === 0) {
      console.log('❌ No bookings found');
      process.exit(0);
    }
    return res.data.data[0]._id;
  })
  .then(bookingId => 
    axios.put('http://localhost:4174/api/bookings/' + bookingId + '/status', {
      status: 'confirmed'
    })
  )
  .then(res => console.log('✅ Status updated:', res.data.message))
  .catch(err => console.log('❌ Error:', err.response?.data?.error || err.message));
"
```

**Expected Console Logs**:
```
📋 [PUT /api/bookings/:id/status] Request received { bookingId: '607g2g88bcf86cd799439013', newStatus: 'confirmed', timestamp: '2025-01-26T11:40:45.123Z' }
✅ [PUT /api/bookings/:id/status] Success { bookingId: '607g2g88bcf86cd799439013', newStatus: 'confirmed', modifiedCount: 1, timestamp: '2025-01-26T11:40:46.456Z' }
```

---

## Reviews Endpoints

### 14. POST /api/reviews - Submit a Review

**Description**: Post a review for machinery after booking completion

**Request Body**:
```json
{
  "machineryId": "507f1f77bcf86cd799439011",
  "bookingId": "607g2g88bcf86cd799439013",
  "reviewerId": "507f1f77bcf86cd799439012",
  "reviewerName": "Farmer Name",
  "overallRating": 5,
  "conditionRating": 5,
  "performanceRating": 4,
  "valueForMoneyRating": 5,
  "ownerBehaviorRating": 5,
  "title": "Excellent tractor!",
  "comment": "Very well maintained and powerful tractor. Highly recommended.",
  "pros": ["Smooth operation", "Good fuel efficiency"],
  "cons": ["No GPS system"]
}
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

async function test() {
  try {
    // Get machinery
    const macRes = await axios.get('http://localhost:4174/api/machinery?limit=1');
    if (macRes.data.data.length === 0) {
      console.log('❌ No machinery found');
      process.exit(0);
    }

    const machineryId = macRes.data.data[0]._id;
    const ownerId = macRes.data.data[0].ownerId;

    // Create reviewer user
    const userRes = await axios.post('http://localhost:4174/api/auth/register', {
      name: 'Reviewer ' + Date.now(),
      email: 'reviewer' + Date.now() + '@test.com',
      password: 'Pass123!',
      phone: '+91' + Math.floor(Math.random() * 10000000000)
    });

    const reviewerId = userRes.data.data.user._id;

    // Submit review
    const reviewRes = await axios.post('http://localhost:4174/api/reviews', {
      machineryId: machineryId,
      reviewerId: reviewerId,
      reviewerName: userRes.data.data.user.name,
      overallRating: 4,
      comment: 'Great machinery for the price!'
    });

    console.log('✅ Review submitted:', reviewRes.data.data._id);
  } catch (err) {
    console.log('❌ Error:', err.response?.data?.error || err.message);
  }
  process.exit(0);
}
test();
"
```

**Expected Console Logs**:
```
📋 [POST /api/reviews] Request received { machineryId: '507f1f77bcf86cd799439011', reviewerId: '507f1f77bcf86cd799439012', rating: 5, timestamp: '2025-01-26T11:45:20.123Z' }
✅ [POST /api/reviews] Success { reviewId: '708h3h99bcf86cd799439014', machineryId: '507f1f77bcf86cd799439011', rating: 5, timestamp: '2025-01-26T11:45:21.456Z' }
```

---

### 15. GET /api/reviews - Get All Reviews

**Test with cURL**:
```bash
curl "http://localhost:4174/api/reviews"
```

---

### 16. GET /api/reviews/machinery/:machineryId - Get Reviews for Machinery

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

axios.get('http://localhost:4174/api/machinery?limit=1')
  .then(res => res.data.data[0]._id)
  .then(macId => axios.get('http://localhost:4174/api/reviews/machinery/' + macId))
  .then(res => console.log('✅ Reviews found:', res.data.data.length))
  .catch(err => console.log('❌ Error:', err.message));
"
```

**Expected Console Logs**:
```
📋 [GET /api/reviews/machinery/:machineryId] Request received { machineryId: '507f1f77bcf86cd799439011', timestamp: '2025-01-26T11:50:35.123Z' }
```

---

## Messages Endpoints

### 17. POST /api/messages - Send a Message

**Description**: Send a message between farmers and owners

**Request Body**:
```json
{
  "senderId": "507f1f77bcf86cd799439012",
  "senderName": "Renter Name",
  "receiverId": "507f1f77bcf86cd799439011",
  "receiverName": "Owner Name",
  "content": "Can I book the tractor for next week?",
  "messageType": "text",
  "relatedMachineryId": "507f1f77bcf86cd799439011"
}
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

async function test() {
  try {
    // Register two users
    const user1Res = await axios.post('http://localhost:4174/api/auth/register', {
      name: 'User1 ' + Date.now(),
      email: 'user1' + Date.now() + '@test.com',
      password: 'Pass123!',
      phone: '+91' + Math.floor(Math.random() * 10000000000)
    });

    const user2Res = await axios.post('http://localhost:4174/api/auth/register', {
      name: 'User2 ' + Date.now(),
      email: 'user2' + Date.now() + '@test.com',
      password: 'Pass123!',
      phone: '+91' + Math.floor(Math.random() * 10000000000)
    });

    // Send message
    const msgRes = await axios.post('http://localhost:4174/api/messages', {
      senderId: user1Res.data.data.user._id,
      senderName: user1Res.data.data.user.name,
      receiverId: user2Res.data.data.user._id,
      receiverName: user2Res.data.data.user.name,
      content: 'Hello! Are you interested in renting?',
      messageType: 'text'
    });

    console.log('✅ Message sent:', msgRes.data.data._id);
  } catch (err) {
    console.log('❌ Error:', err.response?.data?.error || err.message);
  }
  process.exit(0);
}
test();
"
```

**Expected Console Logs**:
```
📋 [POST /api/messages] Request received { senderId: '507f1f77bcf86cd799439012', receiverId: '507f1f77bcf86cd799439011', messageType: 'text', timestamp: '2025-01-26T11:55:50.123Z' }
✅ [POST /api/messages] Success { messageId: '809i4i00bcf86cd799439015', conversationId: 'conv-507f1f77bcf86cd799439011-507f1f77bcf86cd799439012', senderId: '507f1f77bcf86cd799439012', receiverId: '507f1f77bcf86cd799439011', timestamp: '2025-01-26T11:55:51.456Z' }
```

---

### 18. GET /api/messages - Get All Messages

**Test with cURL**:
```bash
curl "http://localhost:4174/api/messages"
```

---

### 19. GET /api/messages/conversation/:userId/:otherUserId - Get Conversation

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

axios.get('http://localhost:4174/api/messages/conversation/507f1f77bcf86cd799439012/507f1f77bcf86cd799439011')
  .then(res => console.log('✅ Messages:', res.data.data.length))
  .catch(err => console.log('❌ Error:', err.response?.data?.error || err.message));
"
```

**Expected Console Logs**:
```
📋 [GET /api/messages/conversation/:userId/:otherUserId] Request received { userId: '507f1f77bcf86cd799439012', otherUserId: '507f1f77bcf86cd799439011', timestamp: '2025-01-26T12:00:10.123Z' }
```

---

## Weather Endpoint

### 20. GET /api/weather/forecast - Get Weather Forecast

**Description**: Get weather forecast for a location

**Query Parameters**:
- `q`: Location name (city or coordinates)
- `days`: Number of days (default: 7)

**Test with cURL**:
```bash
curl "http://localhost:4174/api/weather/forecast?q=Pune&days=7"
curl "http://localhost:4174/api/weather/forecast?q=Maharashtra,India&days=5"
```

**Test with Node.js**:
```bash
node -e "
const axios = require('axios');

axios.get('http://localhost:4174/api/weather/forecast', {
  params: { q: 'Pune', days: 7 }
})
  .then(res => console.log('✅ Weather:', res.data.data.location.name))
  .catch(err => console.log('❌ Error:', err.response?.data?.error || err.message));
"
```

**Expected Console Logs**:
```
📋 [GET /api/weather/forecast] Request received { location: 'Pune', days: 7, timestamp: '2025-01-26T12:05:25.123Z' }
✅ [GET /api/weather/forecast] Success { location: 'Pune', days: 7, timestamp: '2025-01-26T12:05:26.456Z' }
```

---

## Viewing Logs

All logs will appear in your backend server terminal. Example:

```
📋 [POST /api/auth/register] Request received { email: 'test@example.com', name: 'John Doe', timestamp: '2025-01-26T10:30:45.123Z' }
✅ [POST /api/auth/register] Success { userId: '507f1f77bcf86cd799439011', email: 'test@example.com', timestamp: '2025-01-26T10:30:46.456Z' }
```

**Log Format**:
- 📋 = Request received
- ✅ = Successfully executed
- ❌ = Failed (if implemented)

---

## Quick Test Script

Run all major endpoints:

```bash
node -e "
const axios = require('axios');

async function runTests() {
  const tests = [
    {
      name: 'Register',
      fn: () => axios.post('http://localhost:4174/api/auth/register', {
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'Pass123!',
        phone: '+91' + Math.floor(Math.random() * 10000000000)
      })
    },
    {
      name: 'Get Machinery',
      fn: () => axios.get('http://localhost:4174/api/machinery')
    },
    {
      name: 'Weather',
      fn: () => axios.get('http://localhost:4174/api/weather/forecast?q=Pune')
    }
  ];

  for (const test of tests) {
    try {
      await test.fn();
      console.log('✅', test.name);
    } catch (err) {
      console.log('❌', test.name, ':', err.response?.data?.error || err.message);
    }
  }
  process.exit(0);
}

runTests();
"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | Make sure backend is running on port 4174 |
| `Missing required fields` | Check request body matches specification |
| `Invalid token` | Generate new token via login endpoint |
| `Machinery not found` | Run seed script: `node scripts/seedDemoMachinery.js` |
| `Weather API error` | Set `WEATHER_API` env variable in `.env` |

