# MongoDB End-to-End Explanation (For Viva)

## 1) Why MongoDB was used
This project has multiple feature domains with flexible data shapes:
- users
- machinery listings
- booking transactions
- chat messages
- disease records
- crop lifecycle logs

MongoDB is suitable because document structures can evolve per feature without strict table migrations in early-stage product development.

## 2) How connection is established in this project
Main file: `backend/config/database.js`

Core flow:
1. Read `MONGO_URI` from environment
2. Create `MongoClient` with stable API version (`ServerApiVersion.v1`)
3. Connect once and select database `FarmConnect`
4. Reuse same `db` object for all requests

This avoids creating a new DB connection on every API call.

## 3) Singleton connection pattern in simple words
In code:
- `connectToDatabase()`
- `getDatabase()`

Behavior:
- First call connects and stores `db` in memory
- Next calls reuse existing object

Why this matters:
- lower latency
- better stability under traffic
- prevents connection explosion

## 4) Collections used in this project
Defined in `collections` object:
- `users`
- `machinery`
- `schemes`
- `bookings`
- `diseases`
- `messages`
- `conversations`
- `farmerCrops`
- `cropActions`
- `cropRecommendations`

## 5) Startup initialization and index strategy
`initializeCollections()` runs at backend startup and ensures required collections/indexes exist.

Important indexes:
- `farmerCrops`: `userId`, `status`, `createdAt`
- `cropActions`: `userId`, `cropId`, `actionDate`, compound (`userId`, `actionDate`)
- `cropRecommendations`: `userId`, `createdAt`, TTL on `expiresAt`

TTL index:
- documents in `cropRecommendations` auto-expire when `expiresAt` time is reached
- useful for temporary AI recommendations cache

## 6) How data is stored and fetched (feature-wise)

## Users (`backend/api/users.js`)
- Register: `insertOne(newUser)` after bcrypt hashing
- Login: `findOne` with email/phone
- Profile fetch: `findOne` with projection excluding password

## Machinery (`backend/api/machinery.js`)
- Create listing: `insertOne`
- List fetch with filters: `find(filter).sort().skip().limit()`
- Single fetch: `findOne`
- Update: `updateOne($set)`
- Soft delete: `updateOne($set isActive:false)`

## Bookings (`backend/api/bookings.js`)
- Create booking: `insertOne`
- Then update machinery: `updateOne($push bookedDates, $inc totalBookings)`
- User/owner booking lists: filtered find + pagination
- Status transitions: `updateOne($set timestamps by status)`
- Cancel booking: update booking + `machinery.$pull` booked slot

## Disease Records (`backend/api/diseases.js`)
- Save detection: `insertOne`
- Fetch history: `find({userId}).sort({createdAt:-1}).limit(50)`

## Messages (`backend/api/messages.js`)
- Send message: `insertOne` in messages
- Conversation upsert-like behavior: update existing or insert new conversation doc
- Read updates: `updateOne`, `updateMany`
- Soft delete per user: `$addToSet deletedBy`

## Crops and Actions (`backend/api/crops.js`)
- Crop CRUD with authenticated user scope
- Crop actions stored in separate `cropActions`
- Related cleanup on crop delete (`deleteMany` actions)

## 7) Query patterns examiner may ask
This project uses:
- `findOne` for single-document fetch
- `find` with filters + sort + pagination
- `insertOne` for create
- `updateOne`/`updateMany` for status and field mutations
- `deleteOne`/`deleteMany` for hard deletes
- `$set`, `$push`, `$pull`, `$inc`, `$addToSet` operators

## 8) Security and ownership pattern in DB operations
Good pattern used in some modules:
- include `userId` in query filter to ensure user-scoped ownership

Example:
- crops endpoints use `{ _id: cropId, userId: req.user.userId }`

This prevents cross-user modification when correctly applied.

## 9) Performance behavior currently in project
What is already present:
- pagination on listing APIs
- sorting with indexes in initialized collections
- connection reuse singleton pattern
- TTL for short-lived recommendation data

What can be improved:
- add more indexes for heavy booking/machinery query combinations
- enforce stronger compound indexes for frequently filtered fields
- add transaction usage for multi-document critical flows

## 10) Important scaling discussion (high-value viva answer)
Booking creation and machinery date update are currently separate operations.  
In high-concurrency situations, race conditions are possible.  
Production-grade improvement:
- use MongoDB transactions or atomic conditional updates
- enforce stronger conflict constraints in one logical operation

## 11) Deep viva Q&A (MongoDB)

### Q1: Why not SQL database?
The project has heterogeneous feature modules with evolving document structures. MongoDB allowed rapid iteration with nested object flexibility and less migration overhead for this stage.

### Q2: How do you avoid opening too many DB connections?
By singleton pattern in `connectToDatabase` and `getDatabase`, reusing one connected client object.

### Q3: What is TTL index and where used?
TTL index auto-deletes expired documents. Here, it is used on `cropRecommendations.expiresAt` for auto-cleanup of temporary advisory data.

### Q4: How do you implement pagination?
Using `skip` and `limit` with `countDocuments` for page metadata.

### Q5: How do you model chat in MongoDB?
Messages and conversations are separated. Messages store each event; conversations store aggregate state like last message and unread counters.

### Q6: How do you enforce ownership?
By including `userId` in query filter in authenticated routes (for example in crops APIs).

### Q7: Which Mongo operators are used most?
`$set`, `$inc`, `$push`, `$pull`, `$addToSet` are used for update semantics.

### Q8: Where is transaction risk in your current system?
Booking insert and machinery date-block update happen as separate writes, which can race under heavy concurrent requests.

## 12) 60-second database answer
“MongoDB is used as the primary persistence layer across users, machinery, bookings, messages, disease history, and crop tracking. We implemented a singleton connection pattern to reuse one database connection. APIs use standard CRUD operations with Mongo operators like `$set`, `$push`, `$pull`, and `$inc`. We also initialize indexes and a TTL policy for temporary recommendation data. Pagination and sorting are used in listing endpoints. For scale-up, the key next step is transaction-safe booking conflict writes.”
