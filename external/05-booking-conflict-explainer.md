# Machinery Booking Conflict Handling (Detailed Viva Notes)

## Business problem this module solves
In a rental system, the same machine can be requested by multiple users for overlapping dates. If there is no conflict control, double-booking happens, causing operational failure and trust issues.

## How conflict handling is implemented
When a booking request comes, backend checks requested start/end dates against already booked intervals of that machine. The overlap condition is:

`requestStart <= existingEnd && requestEnd >= existingStart`

If this condition is true for any existing booking, the new booking is rejected.

This is standard interval intersection logic and is easy to justify in viva.

## Booking lifecycle explained
1. User selects machine and date range.
2. Backend validates machine and date inputs.
3. Backend performs overlap/conflict check.
4. If valid, booking is created (initially pending/approval state).
5. Booked date block is stored in machine schedule data.
6. Status changes through lifecycle: pending, confirmed, active, completed, cancelled.

This demonstrates business workflow control, not only data entry.

## Why this design is meaningful
- Prevents clear schedule collisions
- Keeps booking history traceable
- Enables owner-renter coordination
- Supports future analytics (utilization, peak demand windows)

## Important examiner question: “Will this work under heavy concurrency?”
A strong answer:
“Current implementation handles normal conflict scenarios correctly at application level. For high concurrency and race-condition safety, next production step is atomic check-and-write using transactions or conditional updates.”

This is a technically mature answer because it acknowledges real-world scaling behavior.

## Improvement roadmap you can present
1. Atomic booking write with conflict guard in single DB operation
2. Idempotent booking request keys to avoid duplicate submissions
3. Optional slot-level locking for high traffic machines
4. Better cancellation and retry audit trails

## 30-second version
“Booking conflict is handled using date-range overlap logic. Before creating a booking, the backend compares requested interval with existing booked intervals. If overlap exists, request is rejected. This prevents double-booking and maintains a reliable machinery schedule.”
