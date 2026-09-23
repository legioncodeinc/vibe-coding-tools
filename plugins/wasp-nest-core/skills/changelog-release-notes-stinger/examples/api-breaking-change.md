# Example: API Breaking Change Changelog Entry

> Demonstrates: developer-facing language, breaking change format, migration guide reference, multi-channel distribution.
> Guide references: `guides/03-copy-craft.md`, `guides/04-distribution-channels.md`

---

## Input (what the team provided)

```
We're deprecating the /v1/users/list endpoint. 
New endpoint is /v2/users with cursor-based pagination.
Old endpoint still works but will be removed on 2026-08-01.
Migration guide: https://docs.example.com/migrate/v1-to-v2-users
Breaking: response shape changed - `data.users[]` becomes `data.items[]`
```

---

## Output (the changelog entry)

```markdown
## [API] v1/users/list Deprecated: Migrate to v2/users by 2026-08-01

**The `/v1/users/list` endpoint is deprecated.** The replacement `GET /v2/users` is live today with cursor-based pagination and a larger default page size. The v1 endpoint continues to work until **2026-08-01**, when it will be removed.

### What changed

| Old | New |
|---|---|
| `GET /v1/users/list` | `GET /v2/users` |
| Offset pagination (`?page=N`) | Cursor pagination (`?after=cursor`) |
| Response: `data.users[]` | Response: `data.items[]` |
| Max page size: 100 | Max page size: 500 |

### Migration steps

1. Update your endpoint URL from `/v1/users/list` to `/v2/users`.
2. Replace offset pagination (`page`, `per_page`) with cursor pagination (`after`, `limit`).
3. Update your response parsing from `data.users` to `data.items`.

Full migration guide with code examples: [docs.example.com/migrate/v1-to-v2-users](https://docs.example.com/migrate/v1-to-v2-users)

### Timeline

- **Today (2026-05-20):** v2 is live. v1 remains available.
- **2026-07-01:** v1 will return a deprecation warning header (`Deprecation: true`).
- **2026-08-01:** v1 endpoint removed.

Questions? Open a support ticket or post in #api-users on our developer Discord.
```

---

## Distribution checklist

```markdown
## Distribution checklist for API v2 Migration Notice

- [x] Published to changelog platform
- [x] In-app widget badge updated
- [x] Email sent to all API key holders (targeted, not digest)
- [x] Community post in #api-users Discord channel
- [x] Blog post: "Upgrading to the Users v2 API" (migration tutorial)
- [x] In-product banner for dashboard users with API credentials
- [ ] Direct outreach to highest-volume API consumers (manual follow-up)
```

---

## Notes on format

This entry intentionally departs from the standard impact-first template because the primary audience is developers who need migration instructions, not end users discovering a new feature. Rules that changed:
- Table format for API changes is more scannable than bullets.
- Timeline section is mandatory for deprecations: users need to know the deadline.
- A breaking change always justifies direct email, not a weekly digest.
