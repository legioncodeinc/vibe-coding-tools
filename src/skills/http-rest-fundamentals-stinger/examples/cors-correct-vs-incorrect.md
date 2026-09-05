# Example: CORS Correct vs Incorrect

Side-by-side comparison of correct and incorrect CORS configurations for a credentialed API.

---

## Scenario

A React SPA at `https://app.example.com` calls `https://api.example.com/users` with `credentials: 'include'` (sending cookies).

---

## Incorrect configuration

```nginx
# nginx CORS configuration -- WRONG
location /api/ {
    # Problem 1: wildcard with credentials -- browser rejects this
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';

    # Problem 2: no Vary: Origin -- CDN will cache the ACAO for the wrong origin
    # (Vary header missing)

    if ($request_method = 'OPTIONS') {
        # Problem 3: OPTIONS returns 200 with body -- use 204
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type';
        # Problem 4: Authorization header missing -- credentialed requests need it
        # Problem 5: no Access-Control-Max-Age -- browser sends a preflight every time
        return 200;
    }
}
```

**What happens:** The browser throws `CORS error: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.` The JS never receives the response.

---

## Correct configuration

```nginx
# nginx CORS configuration -- CORRECT
map $http_origin $cors_origin {
    default "";
    "https://app.example.com" "https://app.example.com";
    "https://staging.example.com" "https://staging.example.com";
}

location /api/ {
    # Set the exact requesting origin (not wildcard)
    add_header 'Access-Control-Allow-Origin' $cors_origin always;
    # Required for credentialed requests
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    # Required so CDNs don't cache the ACAO for the wrong origin
    add_header 'Vary' 'Origin' always;

    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-Request-Id';
        add_header 'Access-Control-Max-Age' '86400';
        return 204;  # 204 No Content for preflight
    }
}
```

---

## Express.js equivalent (CORS middleware)

```typescript
// WRONG: wildcard with credentials
app.use(cors({
  origin: '*',
  credentials: true,
}));

// CORRECT: specific origins with credentials
const allowedOrigins = ['https://app.example.com', 'https://staging.example.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || '*');
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id', 'X-Rate-Limit-Remaining'],
  maxAge: 86400,
}));
```

---

## Key findings summary

| Issue | Severity | Fix |
|---|---|---|
| `Access-Control-Allow-Origin: *` with `Allow-Credentials: true` | Critical | Replace `*` with explicit origin |
| Missing `Vary: Origin` | High | Add `Vary: Origin` to all CORS responses |
| OPTIONS returning 200 with body | Medium | Return 204 No Content |
| `Authorization` missing from `Access-Control-Allow-Headers` | High | Add `Authorization` to the header list |
| Missing `Access-Control-Max-Age` | Medium | Add `Access-Control-Max-Age: 86400` |
