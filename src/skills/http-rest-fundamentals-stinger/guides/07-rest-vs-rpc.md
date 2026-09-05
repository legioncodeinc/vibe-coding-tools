# 07. REST vs RPC

Fielding's constraints, HATEOAS, versioning strategies, and the honest taxonomy of "REST" APIs.

---

## Fielding's constraints (the official definition)

Roy Fielding's 2000 dissertation defines REST as an architectural style with six constraints. An API is only REST if it satisfies all of them:

1. **Client-server separation** -- UI and data storage concerns are separated. Client does not contain business logic; server does not contain UI logic.
2. **Stateless** -- Every request contains all information needed to process it. The server does NOT hold session state between requests. Horizontal scaling and transparent caching depend on this.
3. **Cacheable** -- Responses must self-describe whether they are cacheable and for how long. Violation degrades performance and correctness.
4. **Uniform interface** -- The most complex constraint; four sub-constraints:
   - **Resource identification in requests:** resources are identified by URIs; the URI is a stable identifier, not a function name.
   - **Resource manipulation through representations:** clients interact with a resource via its representation (JSON, XML, HTML), not by calling procedures.
   - **Self-descriptive messages:** each message includes enough information to describe how to process it (media type, method, headers).
   - **HATEOAS (Hypermedia As The Engine Of Application State):** the server includes links in responses that describe available next actions. The client does not hardcode URLs; it follows links.
5. **Layered system** -- The client cannot tell whether it is connected to the origin or an intermediary. APIs must not break when a proxy or CDN is in the path.
6. **Code on demand (optional)** -- Servers MAY transfer executable code (JavaScript) to clients.

---

## HATEOAS: the constraint most APIs skip

Most self-described "REST" APIs violate HATEOAS. A HATEOAS response looks like:

```json
{
  "id": 42,
  "status": "processing",
  "_links": {
    "self": { "href": "/orders/42" },
    "cancel": { "href": "/orders/42/cancel", "method": "POST" },
    "track": { "href": "/shipments/xyz" }
  }
}
```

The client follows links; it does not hardcode `/orders/42/cancel`. The server can change its URL structure without breaking clients.

**Practical verdict:** HATEOAS is valuable for long-lived, loosely-coupled clients (web browsers following links). For developer APIs consumed by tightly-coupled server-to-server integrations, HATEOAS adds overhead without proportional benefit. This is a legitimate trade-off, but you should name it: "this is an HTTP API, not pure REST."

---

## Honest taxonomy

| Term | What it actually means |
|---|---|
| **REST** | Satisfies all six Fielding constraints including HATEOAS and stateless. Rare in practice. |
| **RESTful** | Informally used for "HTTP API that uses resources and standard methods." Usually missing HATEOAS and stateless constraints. |
| **REST-like / Resource-oriented** | Uses HTTP methods and resource URIs without claiming full Fielding compliance. Honest and appropriate for most APIs. |
| **RPC-over-HTTP** | Uses HTTP as a transport but with procedure-call semantics (POST /users/create, POST /users/delete). Anti-pattern for public APIs. |
| **GraphQL** | Single endpoint (POST /graphql), query language in the body. Deliberately not REST. Not wrong; just different. |
| **gRPC** | HTTP/2 transport, Protocol Buffers serialization, procedural interface. Not REST. Purpose-built for service-to-service communication. |

---

## URL design principles

**Resources, not actions:**
```
# Wrong (RPC)
POST /createUser
GET /getUser?id=42
POST /deleteUser

# Right (resource-oriented)
POST /users
GET /users/42
DELETE /users/42
```

**Plural nouns for collections:**
```
GET /users          # collection
GET /users/42       # individual resource
POST /users         # create in collection
```

**Sub-resources for relationships:**
```
GET /users/42/orders         # orders belonging to user 42
GET /users/42/orders/7       # specific order of user 42
```

**Avoid verbs in URLs except for actions that don't map to a resource:**
```
POST /orders/42/cancel       # acceptable: "cancel" is an action, not a resource
POST /emails/send            # acceptable: "send" has no obvious resource equivalent
```

---

## Versioning strategies

| Strategy | Example | Trade-offs |
|---|---|---|
| URL path versioning | `/v1/users`, `/v2/users` | Explicit, easy to route; breaks URL stability; duplicates endpoints |
| `Accept` header versioning | `Accept: application/vnd.example.v2+json` | Pure REST; invisible in URLs; harder to test in browsers |
| Query parameter | `/users?version=2` | Simple; pollutes the query string; caches work correctly |
| Subdomain | `v2.api.example.com` | Clear separation; DNS overhead; complex routing |

**Recommended default for 2026:** URL path versioning (`/v1/`) for public APIs (explicit, debuggable, widely understood). `Accept` header versioning for internal APIs where URL cleanliness matters.

**Key rule:** Never make a breaking change within a version. A "v1 endpoint" must remain backward-compatible for as long as v1 is supported.

---

## Anti-patterns checklist

- [ ] Are verbs used in URLs where resources should be? (`/getUser`, `/createOrder`)
- [ ] Is POST used for all operations regardless of idempotency?
- [ ] Is there a versioning strategy? Is it documented?
- [ ] Are resources named with plural nouns?
- [ ] Are session tokens or user state stored server-side between requests? (Stateless violation)
- [ ] Does the API return HATEOAS links? If not: is it honestly called "REST-like" rather than "REST"?

---

*Sources: Fielding dissertation (2000), `research/internal/2026-05-20-fielding-dissertation.md`, `research/external/2026-05-20-rest-status-codes-2026.md`*
