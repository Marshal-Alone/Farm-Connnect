# Authentication and JWT (Detailed Viva Explanation)

## What authentication does in this project
Authentication ensures that actions are tied to a real user identity. In this platform, users register or log in, receive a token, and then access personalized modules like crop records and advisory features.

## End-to-end auth flow
1. User sends login/register request to backend auth routes.
2. Backend validates required fields.
3. Password is hashed with `bcrypt` before storing.
4. On successful login, backend generates a JWT token.
5. Frontend stores token and sends it in bearer authorization header.
6. Middleware verifies token and attaches user claims to request.

This lets backend know who is making each protected request.

## What is JWT in simple terms
JWT (JSON Web Token) is a signed identity token. It contains claims such as user ID and email. The backend signs it using a secret key. On future requests, backend verifies the signature. If signature is invalid or token expired, request is denied.

Think of JWT as a signed digital pass that the server can verify quickly.

## Why JWT was chosen
I chose JWT because this project is API-driven and modular. JWT is stateless, which means the server does not need to store per-user session data in memory for each request. This simplifies scaling and works smoothly with frontend clients calling REST APIs.

## JWT vs session, how to explain in viva
Both are valid methods. Session auth stores state server-side; JWT stores signed claims client-side. For this architecture, JWT is simpler for distributed API use. If system grows to multiple services, JWT-based verification remains straightforward.

## Security controls currently implemented
- Password hashing using `bcrypt`
- Token validation middleware for protected routes
- Basic route-level input checks
- Structured error handling in API responses

## Security hardening roadmap (important for examiner confidence)
1. Use strong environment-managed JWT secrets only
2. Expand route protection consistently across modules
3. Add centralized schema validation (not only manual checks)
4. Strengthen payment verification and audit logging
5. Improve token lifecycle controls (rotation/refresh strategy if needed)

This answer shows that you understand both current implementation and production-level evolution.

## 30-second ready response
“Authentication is based on bcrypt password hashing and JWT token authorization. After login, the server issues a signed token, and protected APIs verify that token for each request. JWT was selected because this is an API-first architecture and stateless auth simplifies scaling and integration.”
