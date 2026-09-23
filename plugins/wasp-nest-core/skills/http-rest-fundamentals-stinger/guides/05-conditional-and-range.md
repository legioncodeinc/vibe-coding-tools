# 05. Conditional and Range Requests

ETag, If-None-Match, If-Match, Range, Content-Range, and the 304/412/416 status codes.

---

## Why conditional requests matter

Conditional requests allow clients and servers to:
1. **Avoid re-downloading unchanged content** (cache validation with ETag / If-None-Match).
2. **Prevent lost updates in concurrent writes** (optimistic concurrency with ETag / If-Match).
3. **Resume interrupted downloads** (range requests with Range / Content-Range).

These are core HTTP features, not advanced topics. APIs that ignore them force clients to re-download the same data and cannot prevent concurrent write conflicts.

---

## ETag: identifying a resource version

An ETag is an opaque identifier for a specific version (representation) of a resource.

- **Strong ETag:** `ETag: "abc123"` -- byte-for-byte identical match required.
- **Weak ETag:** `ETag: W/"abc123"` -- semantically equivalent (content equivalent, possibly different encoding or minor formatting).

The server generates ETags. Common approaches:
- Hash of the response body: `ETag: "md5:<hash>"`
- Database row version number: `ETag: "version:42"`
- Last-modified timestamp as a hash

**CDN note:** ETags are often stripped by CDN edges unless configured to preserve them. If ETags are stripped, conditional requests degrade to full round-trips. Verify ETag headers survive the CDN layer in production.

---

## If-None-Match: cache validation

The client sends the ETag it received previously:
```
GET /api/resource/42
If-None-Match: "abc123"
```

**Server responses:**
- If the resource hasn't changed (ETag still matches): `304 Not Modified` with no body. The client uses its cached copy.
- If the resource has changed: `200 OK` with the new body and a new ETag.

This is far more reliable than `If-Modified-Since` because ETags are opaque and don't have 1-second resolution issues.

### If-Modified-Since: time-based cache validation
```
GET /api/resource/42
If-Modified-Since: Wed, 01 Jan 2025 00:00:00 GMT
```

- If unchanged: `304 Not Modified`.
- If changed: `200 OK` with new body.

Use ETags when available; fall back to `If-Modified-Since` when ETags are not provided.

---

## If-Match: optimistic concurrency control

The client sends an ETag to assert the current state before writing:
```
PUT /api/resource/42
If-Match: "abc123"
Content-Type: application/json
{...new body...}
```

**Server responses:**
- If the ETag matches: proceed with the update, return 200 or 204.
- If the ETag doesn't match (someone else modified it): `412 Precondition Failed`. The client should fetch the current state and retry.
- If the resource doesn't exist: 404 (or 201 if PUT is creating it).

**Use case:** Prevent "lost update" in concurrent writes. Without If-Match, two users editing the same resource simultaneously will silently overwrite each other's changes.

### If-Unmodified-Since
Time-based equivalent of If-Match. Less precise; prefer If-Match + ETag.

---

## 304 Not Modified

- Returned when an If-None-Match or If-Modified-Since conditional evaluates to "unchanged."
- Must NOT include a response body.
- Must include the same headers that would have been included in a 200 response: `ETag`, `Cache-Control`, `Content-Location`, `Expires`, `Vary`.

---

## 412 Precondition Failed

- Returned when an If-Match or If-Unmodified-Since conditional fails.
- The client's version is stale; it must refresh and retry.

---

## Range requests: partial content

Range requests allow clients to download a specific byte range of a resource. Used for:
- Video/audio streaming (seek to position)
- Resuming interrupted downloads
- Paginating large binary resources

### Server advertising support
```
Accept-Ranges: bytes
```
If the server does not support ranges: `Accept-Ranges: none`.

### Client requesting a range
```
GET /files/video.mp4
Range: bytes=0-1048575
```
(First 1 MB)

### Server responding with partial content
```
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1048575/52428800
Content-Length: 1048576
Content-Type: video/mp4
```

### 416 Range Not Satisfiable
Returned when the requested range is invalid (e.g., start > file size, or invalid syntax):
```
HTTP/1.1 416 Range Not Satisfiable
Content-Range: bytes */52428800
```

---

## Practical checklist

- [ ] Are GET endpoints returning ETag and/or Last-Modified?
- [ ] Are 304 responses sent without a body?
- [ ] Are PUT/PATCH endpoints checking If-Match for concurrent write protection?
- [ ] Do 412 responses explain which precondition failed?
- [ ] Does the server send `Accept-Ranges: bytes` for downloadable resources?
- [ ] Do 206 responses include correct `Content-Range` headers?
- [ ] Are ETags preserved through the CDN layer?

---

*Sources: RFC 9110 §13 (conditional requests), RFC 9110 §14 (range requests), `research/external/2026-05-20-etag-conditional-requests.md`, `research/external/2026-05-20-http-caching-etag-cdn.md`*
