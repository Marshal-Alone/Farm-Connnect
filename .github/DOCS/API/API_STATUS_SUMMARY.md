# API Route Status Summary

**Last Generated:** December 26, 2025
**Status:** Farm Connect API routes verified and documented

---

## Routes by Status

### ✅ FULLY WORKING (11 routes)

```
✅ POST   /api/auth/login                    → User authentication
✅ GET    /api/auth/me                       → Get logged-in user info
✅ GET    /api/machinery                     → List all machinery
✅ GET    /api/machinery/:id                 → Get machinery details
✅ POST   /api/machinery                     → Create machinery
✅ DELETE /api/machinery/:id                 → Delete machinery
✅ POST   /api/bookings                      → Create booking
✅ GET    /api/bookings/user/:userId         → Get user's bookings
✅ GET    /api/bookings/owner/:ownerId       → Get owner's booking requests
✅ GET    /api/health                        → Server health check
✅ GET    /api/ping                          → Server ping
```

### ⚠️ PARTIALLY WORKING (5 routes)

```
⚠️ PUT    /api/machinery/:id                 → Edit machinery (BROKEN - returns 404)
⚠️ PUT    /api/bookings/:id/status           → Update booking status (may be incomplete)
⚠️ GET/POST /api/reviews                     → Review operations (limited testing)
⚠️ GET    /api/reviews/machinery/:machineryId → Get machinery reviews (limited data)
⚠️ GET/POST /api/messages                    → Messaging (not fully integrated)
```

### ❌ NOT VERIFIED / NOT IMPLEMENTED

```
❌ POST   /api/auth/register                 → User registration (not heavily tested)
❌ GET    /api/machinery/nearby              → Geospatial search (not implemented)
❌ GET    /api/weather/forecast              → Weather API (service layer exists, frontend not integrated)
❌ GET    /api/messages/conversation/:userId/:otherUserId → Conversation history
```

---

## Quick Verification Steps

### Test Login (POST /api/auth/login)
1. Open app → Click login button
2. Enter: `email: ram@farmer.com, password: password123`
3. Check DevTools → Application → LocalStorage → Find `FarmConnect_token`
4. ✅ If token appears as JWT, login is working

### Test Machinery Listing (GET /api/machinery)
1. Navigate to **Machinery Marketplace** page
2. Equipment cards should display (Laptop, Plant, Tractor names)
3. DevTools → Network tab → look for GET /api/machinery with 200 response
4. ✅ If cards appear and response shows data, route works

### Test Creating Booking (POST /api/bookings)
1. Click any machinery → opens Machinery Detail
2. Select dates with date picker
3. Click "Book Now"
4. Booking confirmation appears
5. DevTools → Network → POST /api/bookings should show 201 Created
6. ✅ If booking appears in bookings list, route works

### Test Owner Dashboard (GET /api/bookings/owner/:ownerId)
1. Login as owner account
2. UserProfile → Dashboard tab → "Booking Requests" sub-tab
3. All bookings for owner's machinery should appear
4. ✅ If bookings display, route works

---

## Database Test Data Available

**Default Test User (Farmer):**
- Email: `ram@farmer.com`
- Password: `password123`
- ID: `692aae843671cc02142f93cc`

**Available Machinery (for testing):**
- Laptop (ID: `694e2b4eb3b95449844dd3a9`)
- Plant (ID: `694e30faaa1020fdfb30cd1c`)
- Tractor
- Harvester

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Login fails | Check email/password match test data above |
| Machinery not showing | Clear cache, check Network tab for 200 response |
| Booking fails | Verify date selection, check browser console for errors |
| Token not saving | Check if localStorage is enabled in browser |
| 404 errors | Check if server is running on port 4174 |
| CORS errors | Verify backend has `Access-Control-Allow-Origin: *` |

---

## See Also

- [SYNOPSIS.md](./SYNOPSIS.md) - Section 5.6.3 for detailed route documentation
- [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) - cURL examples for all endpoints
- [LOGGING_SUMMARY.md](./LOGGING_SUMMARY.md) - Request/response logging details
