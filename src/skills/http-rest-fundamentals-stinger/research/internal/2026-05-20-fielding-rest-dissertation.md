---
source_url: https://ics.uci.edu/~fielding/pubs/dissertation/top.htm
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: rest-architecture
stinger: http-rest-fundamentals-stinger
---

# Roy Fielding's Dissertation - REST Architectural Constraints (2000)

## Summary
Fielding's 2000 dissertation "Architectural Styles and the Design of Network-based Software Architectures" defines REST (Representational State Transfer) in Chapter 5. REST is an architectural style, not a protocol. The six constraints are: (1) Client-Server (separation of concerns), (2) Stateless (server holds no client session state; each request is self-contained), (3) Cache (responses must be labeled cacheable or non-cacheable), (4) Uniform Interface (four sub-constraints: resource identification, manipulation through representations, self-descriptive messages, HATEOAS), (5) Layered System (client can't tell if it's talking directly to the server), (6) Code on Demand (optional: server can send executable code to client). What Fielding calls "REST" requires all six constraints. Most APIs claiming to be "RESTful" violate HATEOAS (the "H" in Fielding's Uniform Interface) and are more accurately RPC-over-HTTP.

## Key quotations / statistics
- "REST provides a set of architectural constraints that, when applied as a whole, emphasizes scalability of component interactions, generality of interfaces, independent deployment of components, and intermediary components to reduce interaction latency." (Chapter 5.1)
- "The central feature that distinguishes the REST architectural style from other network-based styles is its emphasis on a uniform interface between components." (Chapter 5.1.5)
- HATEOAS: "hypermedia as the engine of application state": the server drives navigation by embedding hypermedia controls (links) in responses; clients need not know URL structure in advance.
- "REST is not meant to describe a communication protocol." REST applies to any distributed hypermedia system, not only HTTP. HTTP is merely the most common substrate.
- Fielding (2008 blog post, oft-cited): "I am getting frustrated by the number of people calling any HTTP-based interface a REST API."

## Annotations for stinger-forge
- `guides/07-rest-vs-rpc.md`: cite Fielding's six constraints as the authoritative definition. Encode the common REST myth: most "RESTful" APIs skip HATEOAS, making them HTTP+JSON RPC, which is fine but should not be called REST.
- The stateless constraint is the most frequently violated: sessions stored server-side violate REST §5.1.3. Flag server-side session stores as non-REST in audits.
- HATEOAS: include a minimal example of what a HATEOAS response looks like vs a plain JSON response. The absence of HATEOAS is not a bug, just mislabeling.
- `guides/07-rest-vs-rpc.md`: REST vs GraphQL vs gRPC section: GraphQL violates Uniform Interface (one URL, non-uniform methods); gRPC violates Uniform Interface and Stateless; neither is REST by Fielding's definition. Both are valid alternatives, just not REST.
- Versioning: Fielding argues URL versioning (/v1/) violates the resource identification sub-constraint. However, URL versioning is the pragmatic industry standard. Document both positions.
