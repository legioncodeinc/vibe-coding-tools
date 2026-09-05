# Field Mapping Table

*Template -- fill in all rows. Add rows as needed.*

**Product:** {product name}
**CRM:** {CRM name}
**Date:** {YYYY-MM-DD}

---

## Contact / Person fields

| Product field | Product type | CRM object | CRM field | CRM type | Direction | Conversion rule | Notes |
|---|---|---|---|---|---|---|---|
| `{field}` | {string/int/bool/enum/timestamp} | {Contact/Person} | `{crm_field}` | {string/number/enumeration/datetime} | {product→CRM / CRM→product / bi-directional} | {rule or "direct"} | {optional} |

## Company / Account fields

| Product field | Product type | CRM object | CRM field | CRM type | Direction | Conversion rule | Notes |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Deal / Opportunity fields

| Product field | Product type | CRM object | CRM field | CRM type | Direction | Conversion rule | Notes |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

---

## Computed fields (require transformation)

| Source field(s) | Target field | Transformation logic | Direction |
|---|---|---|---|
| {e.g., `subscription.plan` (enum)} | {e.g., HubSpot `custom_plan_tier` (enumeration)} | {Map: free→"free_tier", starter→"starter_tier"} | product → CRM |

---

## Fields explicitly NOT synced

| Product field | Reason |
|---|---|
| {e.g., `user.password_hash`} | {e.g., security -- never sync credential data to CRM} |
| {e.g., `user.payment_method_id`} | {e.g., PCI scope -- Stripe token, not synced to CRM} |

---

*See `guides/03-field-mapping.md` for dropdown/picklist validation patterns, phone normalization, and attribution field handling.*
