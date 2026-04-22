# Rolewise Viva Guide: Auth and Security Role

## Role Mission
Protect user identity, secure session flow, and ensure that sensitive operations are accessible only to authorized users.

## Core Files
- `backend/api/users.js`: register/login/token generation/token verification
- `frontend/src/contexts/AuthContext.tsx`: token storage, `/auth/me` validation, logout logic
- `backend/index.js`: auth routes mounted under `/api/auth`

## Authentication Flow Summary
1. User registers/logs in
2. Backend hashes password (`bcrypt`)
3. Backend issues JWT with user claims
4. Frontend stores token and sends bearer token in protected requests
5. Backend middleware verifies token and attaches user context

## Security Controls Present
- Password hashing
- Token expiration (`7d`)
- Bearer token verification middleware
- Route-level required-field checks
- Basic ownership filters in selected modules

## Deep Auth/Security Viva Q&A

### Q1: Why bcrypt for passwords?
Bcrypt is a one-way hashing algorithm with salting and work factor, making password cracking harder than plain hashes.

### Q2: Why JWT in this architecture?
JWT is stateless and fits modular API-based architecture where frontend calls backend endpoints directly.

### Q3: What claims are stored in JWT?
`userId`, `email`, and `name` are included as identity claims.

### Q4: How does middleware verify token?
It parses bearer token from authorization header and verifies signature and expiry.

### Q5: What happens if token is invalid?
Middleware returns unauthorized/forbidden response and request is blocked.

### Q6: How is session persisted on frontend?
Token is stored and validated via `/auth/me` on app load; invalid token is automatically removed.

### Q7: Why not only localStorage-free session?
For this implementation, token-based stateless auth was simpler for API integration. Session-store architecture can be added if needed.

### Q8: Are all APIs protected?
Not all in current version. Some routes are protected and some are open; broader auth coverage is a hardening improvement.

### Q9: How do you prevent key leakage for AI providers?
Server-side proxy routes are used for provider calls so frontend does not directly expose server keys.

### Q10: What are known security improvements?
Centralized schema validation, stricter RBAC/ownership checks across all routes, secure secret management, and payment signature verification completion.

### Q11: How would you add role-based access control?
Include role claim in token and enforce route guards/middleware per role capability matrix.

### Q12: How would you improve token lifecycle?
Introduce refresh tokens, rotation strategy, and revocation store if security requirements increase.

## Trap Questions + Recovery

### Trap: “JWT means fully secure by default.”
Recovery: JWT is only one part. Real security also requires secure secret handling, route authorization, validation, and operational controls.

### Trap: “Using localStorage is insecure, so your auth is wrong.”
Recovery: It is a practical approach for this app stage. We can migrate to httpOnly cookie strategy if threat model demands stronger XSS mitigation.

## 75-second Auth/Security Answer Script
“Authentication uses bcrypt password hashing and JWT-based authorization. On login/register, the backend signs a token containing user identity claims. Protected endpoints verify this token and allow access only when valid. Frontend stores the token and validates session on app startup by calling `/auth/me`. Security controls include hashed passwords, token expiry, and middleware-based checks. For production hardening, we can expand route protection, centralized validation, stronger secret governance, and payment verification controls.”
