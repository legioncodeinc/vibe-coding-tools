# Serde container attributes
- URL: https://serde.rs/container-attrs.html
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: current first-party Serde reference

## Captured source material

```rust
#[serde(rename_all = "camelCase")]
#[serde(rename_all_fields = "camelCase")]
```

The first attribute controls enum variant or container field naming. The second applies the naming rule to fields inside every struct variant of an enum.

## Archive interpretation

A tagged event enum containing struct variants needs both attributes when JavaScript expects camelCase for the discriminator value and the nested data fields.
