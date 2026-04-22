# Rolewise Viva Guide: Database Role

## Role Mission
Design data persistence strategy, model collections for each feature, optimize access patterns, and keep data operations reliable across all modules.

## Core Database Files
- `backend/config/database.js`: connection, singleton, collections, indexes
- `backend/api/users.js`: user identity data access
- `backend/api/machinery.js`: listing and filters
- `backend/api/bookings.js`: transactional booking writes and status updates
- `backend/api/messages.js`: chat and conversation state
- `backend/api/crops.js`: crop/action lifecycle data
- `backend/api/diseases.js`: disease history records

## Data Modeling Philosophy
The project uses feature-oriented document collections.  
Each feature stores domain-specific documents, and cross-feature linkage uses IDs and embedded snapshots where useful.

## Collections and what they hold
- `users`: profile + auth fields
- `machinery`: asset data, availability, booking slots
- `bookings`: booking transaction record and lifecycle
- `messages`: message-level events
- `conversations`: aggregate chat state (last message/unread)
- `diseases`: diagnosis history
- `farmerCrops`: crop lifecycle records
- `cropActions`: operation/event logs per crop
- `cropRecommendations`: advisory cache with expiration

## Deep Database Viva Q&A

### Q1: How do you connect to MongoDB?
Using `MongoClient` in `database.js`, then selecting `FarmConnect` database and reusing it via singleton helper methods.

### Q2: Why singleton DB helper?
To avoid repeated connection creation and improve runtime stability and latency.

### Q3: How are indexes managed?
During startup `initializeCollections()` creates needed indexes for crops/actions/recommendations and TTL index for recommendation expiry.

### Q4: What is TTL used for here?
Auto-expiration of `cropRecommendations` based on `expiresAt`, keeping temporary data clean without manual cron deletion.

### Q5: How do you support pagination?
Using sorted queries with `skip`/`limit` and returning pagination metadata.

### Q6: How do you handle counters and arrays in updates?
Mongo operators:
- `$inc` for counters (e.g., total bookings/views)
- `$push` for appending booked date blocks
- `$pull` for removing canceled bookings from date blocks
- `$addToSet` for safe set-like updates (deletedBy user list)

### Q7: How is chat modeled in DB?
Message documents for chronological events + conversation documents for quick conversation list and unread tracking.

### Q8: How do you enforce user ownership?
In scoped routes, filters include `userId` with document ID to prevent cross-user operations.

### Q9: Any race-condition risk in current design?
Yes. Multi-document write operations (booking create + machinery update) can race under heavy concurrency without transactions.

### Q10: How would you make it transaction-safe?
Use MongoDB transactions or atomic conditional update patterns for conflict-check and booking-write in one protected flow.

### Q11: Why document DB is suitable here?
Feature modules have varying structures and evolving fields; document model reduces migration overhead during iterative product development.

### Q12: How would you improve observability in DB layer?
Add query performance metrics, slow query logs, and health dashboards around index efficiency and write contention.

## Trap Questions + Recovery

### Trap: “NoSQL means no schema discipline.”
Recovery: Schema can still be enforced at application level and with validation layers; NoSQL here gives flexibility, not disorder.

### Trap: “If no transactions everywhere, system is invalid.”
Recovery: Current design is functionally valid for normal load; transaction-hardening is identified for scale-critical paths.

## 80-second Database Answer Script
“The project uses MongoDB with a singleton connection pattern for stable server performance. Data is organized into feature-specific collections such as users, machinery, bookings, messages, diseases, and crop lifecycle logs. APIs use Mongo CRUD operations with operators like `$set`, `$push`, `$pull`, and `$inc`. We initialize indexes at startup and use TTL for temporary recommendation cleanup. Pagination and sorting are implemented in list endpoints. For future scale, the priority enhancement is transaction-safe booking conflict writes.”
