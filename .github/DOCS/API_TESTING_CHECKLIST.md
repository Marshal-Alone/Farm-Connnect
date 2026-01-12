# Farm Connect - API Testing Checklist

**Date:** December 26, 2025  
**Status:** Ready for Testing  
**Print this page to use while testing!**

---

## ✅ Frontend Testing Checklist (No Terminal Needed)

### 1. Authentication Tests

- [ ] **POST /api/auth/login** - User Login
  - [ ] Open app
  - [ ] Click "Login" button
  - [ ] Enter: `ram@farmer.com` / `password123`
  - [ ] Click "Login"
  - [ ] Expected: Redirects to UserProfile
  - [ ] Check: DevTools → Application → LocalStorage → `FarmConnect_token` exists
  - [ ] Status: ✅ Working

- [ ] **GET /api/auth/me** - Get Current User
  - [ ] After login, UserProfile loads automatically
  - [ ] Expected: Your name, farm size, crops display
  - [ ] Check: All user data appears correctly
  - [ ] Status: ✅ Working

---

### 2. Machinery Listing Tests

- [ ] **GET /api/machinery** - Browse Equipment
  - [ ] Navigate to "Machinery Marketplace"
  - [ ] Expected: Equipment cards appear (Laptop, Plant, Tractor, etc.)
  - [ ] Check: DevTools → Network → GET /api/machinery → Status 200
  - [ ] Count: Should show multiple equipment items
  - [ ] Status: ✅ Working

- [ ] **GET /api/machinery/:id** - View Details
  - [ ] Click any equipment card
  - [ ] Expected: Details page opens with full information
  - [ ] Check: Shows name, price, owner, specifications, reviews
  - [ ] Check: DevTools → Network → GET /api/machinery/[ID] → Status 200
  - [ ] Status: ✅ Working

---

### 3. Machinery Management Tests (Owner Only)

- [ ] **POST /api/machinery** - Create New Equipment
  - [ ] Login as equipment owner
  - [ ] Go to UserProfile → Dashboard tab
  - [ ] Click "Add Machinery" button
  - [ ] Fill form: name, type, price, features
  - [ ] Click "Submit"
  - [ ] Expected: New machinery appears in "My Machinery" list
  - [ ] Check: DevTools → Network → POST /api/machinery → Status 201
  - [ ] Status: ✅ Working

- [ ] **DELETE /api/machinery/:id** - Remove Equipment
  - [ ] Go to UserProfile → Dashboard → "My Machinery" tab
  - [ ] Click "Delete" button on any machinery
  - [ ] Confirm in dialog
  - [ ] Expected: Item removed from list
  - [ ] Check: DevTools → Network → DELETE request → Status 200
  - [ ] Status: ✅ Working

- [ ] **PUT /api/machinery/:id** - Edit Equipment ❌ BROKEN
  - [ ] Go to UserProfile → Dashboard → "My Machinery" tab
  - [ ] Click "Edit" button
  - [ ] Expected: Error occurs ("not found")
  - [ ] Status: ❌ BROKEN - Returns 404
  - [ ] Workaround: Delete and recreate instead

---

### 4. Booking Tests (Farmer/Renter)

- [ ] **POST /api/bookings** - Create Booking
  - [ ] Navigate to Machinery Detail page
  - [ ] Click "Book Now" button
  - [ ] Select start date using calendar
  - [ ] Select end date using calendar
  - [ ] Click "Confirm Booking"
  - [ ] Expected: Booking confirmation appears
  - [ ] Check: DevTools → Network → POST /api/bookings → Status 201
  - [ ] Check: Booking appears in My Bookings with "pending" status
  - [ ] Status: ✅ Working

- [ ] **GET /api/bookings/user/:userId** - View My Bookings
  - [ ] Login as farmer
  - [ ] UserProfile page opens
  - [ ] Go to "My Bookings" tab (or "Activity" tab)
  - [ ] Expected: All bookings you've made appear
  - [ ] Check: Shows machinery name, dates, status, amount
  - [ ] Check: DevTools → Network → GET /api/bookings/user → Status 200
  - [ ] Status: ✅ Working

---

### 5. Booking Management Tests (Owner Only)

- [ ] **GET /api/bookings/owner/:ownerId** - View Booking Requests
  - [ ] Login as equipment owner
  - [ ] Go to UserProfile → Dashboard tab
  - [ ] Click "Booking Requests" sub-tab
  - [ ] Expected: All pending bookings for your machinery appear
  - [ ] Check: Shows renter name, dates, amount, status
  - [ ] Check: DevTools → Network → GET /api/bookings/owner → Status 200
  - [ ] Status: ✅ Working

- [ ] **PUT /api/bookings/:id/status** - Approve/Reject Booking ⚠️ PARTIAL
  - [ ] In "Booking Requests" tab
  - [ ] Click "Approve" button
  - [ ] Expected: Status changes from "pending" to "confirmed"
  - [ ] Expected: OR "Reject" changes to "cancelled"
  - [ ] Check: Badge/status label updates
  - [ ] Status: ⚠️ PARTIAL - May have incomplete transitions
  - [ ] Note: Basic approve/reject works, may need full testing

---

### 6. Review Tests ⚠️ LIMITED DATA

- [ ] **GET/POST /api/reviews** - Manage Reviews
  - [ ] Go to Machinery Detail page
  - [ ] Scroll to "Reviews" section
  - [ ] Expected: Review form appears
  - [ ] Try: Submit review (stars, comment)
  - [ ] Check: Review appears in list
  - [ ] Status: ⚠️ PARTIAL - Form works, limited test data
  - [ ] Issue: Few test reviews in database

- [ ] **GET /api/reviews/machinery/:id** - View Equipment Reviews
  - [ ] On Machinery Detail page
  - [ ] Look at Reviews section below
  - [ ] Expected: Reviews display with star rating
  - [ ] Status: ⚠️ PARTIAL - Only demo reviews show

---

### 7. Message Tests ❌ NOT INTEGRATED

- [ ] **GET/POST /api/messages** - Send Messages
  - [ ] Go to Machinery Detail (after booking)
  - [ ] Look for "Message Owner" button
  - [ ] Expected: Messaging UI appears
  - [ ] Try: Send message
  - [ ] Status: ❌ NOT INTEGRATED - Service exists but UI not wired
  - [ ] Issue: Messages can't be sent through UI

- [ ] **GET /api/messages/conversation/:userId/:otherUserId** - Conversation History
  - [ ] After booking, go to booking details
  - [ ] Look for "Messages" section
  - [ ] Expected: Previous conversation appears
  - [ ] Status: ❌ NOT INTEGRATED - Conversation history not loading

---

### 8. Health/Utility Tests

- [ ] **GET /api/health** - Server Health
  - [ ] Start server: `npm run server`
  - [ ] Check console: Should show "Health endpoint: ..."
  - [ ] Expected: Message displays
  - [ ] Status: ✅ Working

- [ ] **GET /api/ping** - Server Ping
  - [ ] Server console should show "Ping endpoint: ..."
  - [ ] Expected: Message displays
  - [ ] Status: ✅ Working

---

## 🔍 DevTools Inspection Checklist

For each API call, check:

### Network Tab
- [ ] Request appears in Network tab list
- [ ] Method is correct (GET, POST, PUT, DELETE)
- [ ] Status code is expected:
  - 200 OK (GET/PUT successful)
  - 201 Created (POST successful)
  - 404 Not Found (broken routes)
  - 400 Bad Request (validation error)
- [ ] Response tab shows returned JSON
- [ ] Response is not empty

### Application/Storage Tab (LocalStorage)
- [ ] After login, `FarmConnect_token` exists
- [ ] Token is not empty
- [ ] Token format: `eyJ...` (valid JWT)
- [ ] Token remains after page refresh
- [ ] Token removed after logout

### Headers Tab
- [ ] For protected routes, check Authorization header
- [ ] Format: `Authorization: Bearer <token>`
- [ ] Token is present and valid
- [ ] Headers show `Content-Type: application/json`

### Console Tab
- [ ] No red error messages
- [ ] No CORS errors
- [ ] No authentication errors
- [ ] Warnings are OK, errors are not

---

## 📊 Quick Status Summary

### Fully Working ✅ (11 Routes)
- [x] POST /api/auth/login
- [x] GET /api/auth/me
- [x] GET /api/machinery
- [x] GET /api/machinery/:id
- [x] POST /api/machinery
- [x] DELETE /api/machinery/:id
- [x] POST /api/bookings
- [x] GET /api/bookings/user/:userId
- [x] GET /api/bookings/owner/:ownerId
- [x] GET /api/health
- [x] GET /api/ping

### Partially Working ⚠️ (5 Routes)
- [ ] PUT /api/machinery/:id (BROKEN - 404)
- [ ] PUT /api/bookings/:id/status (needs testing)
- [ ] GET/POST /api/reviews (limited data)
- [ ] GET /api/reviews/machinery/:id (limited data)
- [ ] GET/POST /api/messages (not integrated)

---

## 🧪 Test Data

**Default Test User (Farmer):**
```
Email:    ram@farmer.com
Password: password123
User ID:  692aae843671cc02142f93cc
```

**Available Test Machinery:**
- Laptop (ID: `694e2b4eb3b95449844dd3a9`)
- Plant (ID: `694e30faaa1020fdfb30cd1c`)
- Tractor (browse marketplace to find)
- Harvester (browse marketplace to find)

---

## 🐛 Known Issues

### Critical ❌
1. **PUT /api/machinery/:id** returns 404
   - Edit button broken
   - Workaround: Delete and recreate

### Medium ⚠️
2. **Messages not integrated** - Can't send/view messages in UI
3. **Reviews limited test data** - Few test reviews to verify with

### Minor ⚠️
4. Booking status transitions may be incomplete

---

## 💾 How to Print This

1. Open [this file](./API_TESTING_CHECKLIST.md)
2. Press Ctrl+P (or Cmd+P on Mac)
3. Print to PDF or printer
4. Use while testing in browser

---

## 📞 Questions?

For detailed procedures, see:
- [API_VERIFICATION_GUIDE.md](./API/API_VERIFICATION_GUIDE.md)
- [SYNOPSIS.md Section 5.6.3](./SYNOPSIS.md)
- [API_INDEX.md](./API_INDEX.md)

---

**Testing Date:** _______________
**Tester Name:** _______________
**Test Results:** ✅ All working / ⚠️ Some issues / ❌ Critical errors

