# Example: Status Code Honesty Audit

Walkthrough of a status-code audit on a sample Express.js API spec.

---

## Input: API under review

```typescript
// POST /users -- create a user
router.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json({ success: true, user });  // returns 200 implicitly
});

// DELETE /users/:id -- delete a user
router.delete('/users/:id', async (req, res) => {
  const deleted = await User.delete(req.params.id);
  if (!deleted) {
    res.json({ success: false, error: 'User not found' });  // 200 on failure
  } else {
    res.json({ success: true });  // 200 on success
  }
});

// POST /users/:id/update -- update a user
router.post('/users/:id/update', async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);
    res.json(user);  // 200
  } catch (e) {
    if (e.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: e.message });  // 400 for validation
    } else {
      res.status(500).json({ error: 'Internal error' });
    }
  }
});
```

---

## Audit findings

### H1: POST /users returns 200 instead of 201

- **Finding:** Resource creation MUST return 201 Created + Location header per RFC 9110 §9.3.3.
- **Impact:** Clients cannot distinguish "updated existing" from "created new" by status code. Caches may store the response incorrectly.
- **Fix:**
```typescript
router.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).location(`/users/${user.id}`).json(user);
});
```

### C1: DELETE /users/:id returns 200 with error body on failure

- **Finding:** Returning 200 with `{"success": false}` is the "200 with error body" anti-pattern. The HTTP status says "success" while the body says "failure."
- **Impact:** Monitoring systems, caches, and any client checking the status code first will misclassify this as success. Rate limit counters may not increment. APM error rate metrics will not reflect this failure.
- **Fix:**
```typescript
router.delete('/users/:id', async (req, res) => {
  const deleted = await User.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      type: 'https://example.com/probs/not-found',
      title: 'User Not Found',
      status: 404,
      instance: `/users/${req.params.id}`
    });
  }
  res.status(204).end();
});
```

### M1: POST /users/:id/update uses verb in URL

- **Finding:** REST resource URLs should not contain verbs. This is RPC-style.
- **Impact:** Not an HTTP error, but violates REST uniform-interface constraint.
- **Fix:** Change to `PATCH /users/:id`.

### M2: Validation error uses 400 instead of 422

- **Finding:** The error is a semantic validation failure (valid JSON, but invalid business rules), not a syntactic malformation. RFC 9110 §15.5.21 defines 422 Unprocessable Content for this case.
- **Fix:**
```typescript
if (e.code === 'VALIDATION_ERROR') {
  res.status(422).json({
    type: 'https://example.com/probs/validation-error',
    title: 'Unprocessable Content',
    status: 422,
    detail: e.message,
  });
}
```

---

## Summary

| Severity | Count | Findings |
|---|---|---|
| Critical | 1 | C1: 200 with error body on DELETE |
| High | 1 | H1: 200 instead of 201 on creation |
| Medium | 2 | M1: verb in URL; M2: 400 instead of 422 |
