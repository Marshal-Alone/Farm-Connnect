# Farm Connect - API Verification Guide

## Quick Reference: Verified API Routes

This guide provides a quick way to verify each API route is working through the frontend UI.

### ✅ Fully Working Routes (11 verified)

#### 1. **POST /api/auth/login** - User Authentication
**How to verify:**
- Open app → Click login
- Enter email: `ram@farmer.com`, password: `password123`
- Check DevTools → Application → LocalStorage → Look for `FarmConnect_token`
- Token should be present and contain JWT format (starts with `eyJ`)

#### 2. **GET /api/auth/me** - Get Current User
**How to verify:**
- After logging in, user data displays in UserProfile page
- Check DevTools → Console → `console.log(localStorage.getItem('FarmConnect_token'))`
- Token should exist for /api/auth/me to work

#### 3. **GET /api/machinery** - List All Machinery
**How to verify:**
- Navigate to **Machinery Marketplace** page
- Equipment list should load with cards displaying (Laptop, Tractor, etc.)
- DevTools → Network tab → look for `GET /api/machinery` with 200 response
- Response contains array of machinery objects

#### 4. **GET /api/machinery/:id** - Get Machinery Details
**How to verify:**
- Click any machinery card from Marketplace
- Details page loads with specs, price, owner info, reviews
- DevTools → Network → `GET /api/machinery/[ID]` returns 200
- All specifications display correctly

#### 5. **POST /api/machinery** - Create New Machinery
**How to verify:**
- Login as machinery owner
- Go to UserProfile → Dashboard tab → "Add Machinery" button
- Fill in name, type, price, images, specs
- Click Submit
- New machinery appears in your "My Machinery" list
- Check Network → POST /api/machinery → 201 Created response

#### 6. **DELETE /api/machinery/:id** - Delete Machinery
**How to verify:**
- UserProfile → Dashboard → My Machinery tab
- Click "Delete" button on any machinery
- Confirmation dialog appears
- Confirm deletion
- Item removed from list
- Check Network → DELETE request → 200 response

#### 7. **POST /api/bookings** - Create Booking
**How to verify:**
- Navigate to any Machinery Detail page
- Click "Book Now" button
- Select start and end dates using date picker
- Click confirm booking
- Booking notification appears
- Check Network → POST /api/bookings → 201 Created
- Booking appears in bookings list

#### 8. **GET /api/bookings/user/:userId** - Get User's Bookings
**How to verify:**
- Login as farmer
- UserProfile page loads automatically
- Go to Dashboard → My Bookings (or Activity tab)
- Your booked machinery appears with dates and status
- Check Network → GET /api/bookings/user/[userId] → 200 response

#### 9. **GET /api/bookings/owner/:ownerId** - Get Owner's Booking Requests
**How to verify:**
- Login as machinery owner
- UserProfile → Dashboard → Booking Requests tab
- All pending/confirmed bookings for your machinery appear
- Shows renter name, dates, amount, status
- Check Network → GET /api/bookings/owner/[ownerId] → 200 response

#### 10. **GET /api/health** - Server Health Check
**How to verify:**
- Start server: `npm run server`
- Check server console output
- Should show: "Health endpoint: http://localhost:4174/api/health"
- Open browser: `http://localhost:4174/api/health`
- Should return 200 OK response

#### 11. **GET /api/ping** - Server Ping
**How to verify:**
- Server running: `npm run server`
- Server logs: "Ping endpoint: http://localhost:4174/api/ping"
- Open browser: `http://localhost:4174/api/ping`
- Should return pong response with timestamp

---

### ⚠️ Partially Working Routes (5 need fixes)

#### 1. **PUT /api/machinery/:id** - Edit Machinery ❌
**Status:** Broken - returns "not found" error
**How it should work:**
- UserProfile → Dashboard → My Machinery → Click "Edit"
- Should navigate to edit form with pre-filled data
- **Current Issue:** Returns 404 not found error

**Workaround:** Delete and recreate machinery instead

#### 2. **PUT /api/bookings/:id/status** - Update Booking Status ⚠️
**Status:** Partially working - basic approval/rejection works
**How to verify:**
- UserProfile → Dashboard → Booking Requests
- Click "Approve" or "Reject" button
- Status badge should change (pending → confirmed/cancelled)
- May have issues with all status transitions

#### 3. **GET/POST /api/reviews** - Reviews ⚠️
**Status:** Partially working - limited testing
**How to verify:**
- Machinery Detail page → scroll to Reviews section
- Submit review form (stars, comment)
- Check Network tab for POST request
- May have data consistency issues

#### 4. **GET /api/reviews/machinery/:machineryId** ⚠️
**Status:** Partially working - limited test data
**How to verify:**
- Machinery Detail page → Reviews section
- Reviews should display for that machinery
- Currently only shows demo/seeded reviews

#### 5. **GET/POST /api/messages** - Messaging ⚠️
**Status:** Partially working - not fully integrated
**How to verify:**
- Machinery Detail page (after booking) → Look for "Message Owner" button
- Booking Details → Messages section
- May not show previous conversation history
- Message service API calls may not be integrated into UI

---

## Quick Testing Checklist

### Frontend Testing (Easy - No Terminal)

- [ ] **Auth** - Login appears to work, token saved
- [ ] **Machinery List** - Marketplace page shows equipment
- [ ] **Machinery Detail** - Click item shows full details
- [ ] **Add Machinery** - Can create new machinery (Owner)
- [ ] **Delete Machinery** - Can remove machinery (Owner)
- [ ] **Book Machinery** - Can create booking (Farmer)
- [ ] **View Bookings** - Can see my bookings (Farmer)
- [ ] **Approve Booking** - Can approve/reject requests (Owner)

### Backend Testing (Via Browser DevTools)

**Network Tab Inspection:**
1. Open DevTools (F12) → Network tab
2. Perform action (login, book machinery, etc.)
3. Find request in Network tab
4. Check:
   - **Status code** (200 OK, 201 Created, 404 Not Found, etc.)
   - **Response** → Preview tab shows returned JSON
   - **Headers** → Request headers include Authorization token

**Example Network Check:**
```
Request: POST /api/bookings
Response Status: 201 Created
Response Preview: {
  "success": true,
  "data": {
    "bookingId": "694e...",
    "bookingNumber": "BK-xxx",
    "finalAmount": 2220
  }
}
```

### Terminal Testing (cURL Commands)

**Get Login Token:**
```bash
TOKEN=$(curl -X POST http://localhost:4174/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"ram@farmer.com","password":"password123"}' | jq -r '.data.token')

echo "Your token: $TOKEN"
```

**Get Machinery List:**
```bash
curl http://localhost:4174/api/machinery?limit=10
```

**Get Specific Machinery:**
```bash
curl http://localhost:4174/api/machinery/694e2b4eb3b95449844dd3a9
```

**Create Booking (requires token):**
```bash
curl -X POST http://localhost:4174/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "machineryId": "694e2b4eb3b95449844dd3a9",
    "renterId": "692aae843671cc02142f93cc",
    "startDate": "2025-12-29T18:30:00Z",
    "endDate": "2025-12-31T18:30:00Z"
  }'
```

---

## Server Logging for Debugging

All API endpoints log request and response details. Check server console:

```
2025-12-26T06:51:24.661Z - POST /api/auth/login
📋 [POST /api/auth/login] Request received { identifier: 'ram@farmer.com', ... }
✅ [POST /api/auth/login] Success { userId: '...', email: '...', ... }
```

**Log Format:**
- 📋 = Request received (inputs logged)
- ✅ = Success (response data logged)
- ❌ = Error (error details logged)

---

## Known Issues to Fix

1. **PUT /api/machinery/:id** - Edit machinery returns 404
2. **Message Integration** - Messages not showing in booking details
3. **Review Testing** - Limited test data for reviews
4. **Status Transitions** - Some booking status changes may not work

---

## How to Report Issues

When an API route fails:
1. Check Network tab in DevTools
2. Note the status code and error message
3. Check server console for detailed error logs
4. Verify data format matches API expectations
5. Check if authentication token is required and present

---

**Last Updated:** December 26, 2025
**Server Version:** Running on port 4174
**MongoDB:** Connected and functional
