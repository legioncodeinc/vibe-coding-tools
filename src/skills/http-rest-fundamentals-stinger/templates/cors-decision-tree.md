# CORS Decision Tree

Use this template to diagnose CORS failures or design a CORS policy from scratch.

---

## Is this a CORS error at all?

**Check first:** Is the request coming from a browser (or browser-based test tool)? CORS only applies to browsers. curl, Postman, and server-to-server requests are NOT subject to CORS.

If CORS is the issue, the browser console will show a message like:
```
Access to fetch at 'https://api.example.com/resource' from origin 'https://app.example.com'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

---

## Step 1: Identify the request type

**Is this a simple request?** (No preflight sent)
- Method: GET, HEAD, or POST only
- Headers set manually: only Accept, Accept-Language, Content-Language, Content-Type (restricted to `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`)

If YES (simple): The browser sends the request directly. Check `Access-Control-Allow-Origin` on the RESPONSE.

If NO (any custom header, Authorization, JSON Content-Type, DELETE/PUT/PATCH): The browser sends an OPTIONS preflight FIRST. Check the OPTIONS response.

---

## Step 2: Check the ACAO header

Does the response include `Access-Control-Allow-Origin`?

**No header:** The server does not permit cross-origin requests (or CORS middleware is not running). Add CORS middleware.

**`Access-Control-Allow-Origin: *`:** Allowed for non-credentialed requests. NOT allowed when `Access-Control-Allow-Credentials: true` is also present. See Step 3.

**`Access-Control-Allow-Origin: https://app.example.com`:** Correct for credentialed requests. Make sure the value matches the request `Origin` exactly (scheme + host + port).

---

## Step 3: Are credentials involved?

Does the client use `credentials: 'include'` (Fetch) or `withCredentials: true` (XHR)?

**No:** Wildcard `*` is allowed in ACAO. No `Access-Control-Allow-Credentials` needed.

**Yes:** All three of these MUST be explicitly set; wildcards are forbidden:
```
Access-Control-Allow-Origin: https://app.example.com  (MUST be specific)
Access-Control-Allow-Credentials: true
Vary: Origin
```

If ACAO is `*` AND ACAC is `true`: the browser rejects it. Fix: replace `*` with the explicit origin.

---

## Step 4: For preflighted requests, check the OPTIONS response

The preflight response must include:
```
Access-Control-Allow-Origin: {origin or *}
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: {list of custom headers}
Access-Control-Max-Age: 86400
```

**Common failure:** `Authorization` header is not listed in `Access-Control-Allow-Headers`. Add it explicitly:
```
Access-Control-Allow-Headers: Authorization, Content-Type, X-Request-Id
```

**Auth-before-CORS gotcha:** Does the OPTIONS response return 401 or 403? This means auth middleware is running before CORS headers are set. Move CORS middleware BEFORE auth middleware, or exempt OPTIONS requests from auth.

---

## Step 5: Check exposed headers

Does the JS client try to read custom response headers (X-Request-Id, X-Rate-Limit-Remaining, etc.)?

By default, only six headers are accessible. Add:
```
Access-Control-Expose-Headers: X-Request-Id, X-Rate-Limit-Remaining
```

---

## CORS policy design template

```
# Non-credentialed public API:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400

# Credentialed API (cookies or HTTP auth):
Access-Control-Allow-Origin: https://app.example.com  # must be specific
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Vary: Origin
```
