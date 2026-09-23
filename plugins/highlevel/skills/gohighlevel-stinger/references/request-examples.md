# Copy-paste request examples: curl + TypeScript fetch

Grounding: [raw/ghl--contacts--create-update-upsert-recipes.md], [raw/ghl--auth--agency-vs-location-access-tokens.md], [raw/ghl--opportunities--pipelines-and-crud-endpoints.md], [raw/ghl--calendars-conversations--endpoints-overview.md].

## 1. Exchange an authorization code for tokens (OAuth)

```bash
curl -X POST https://services.leadconnectorhq.com/oauth/token \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id=YOUR_CLIENT_ID' \
  -d 'client_secret=YOUR_CLIENT_SECRET' \
  -d 'grant_type=authorization_code' \
  -d 'code=AUTH_CODE_FROM_REDIRECT' \
  -d 'user_type=Location'
```

```typescript
async function exchangeCodeForTokens(code: string) {
  const res = await fetch('https://services.leadconnectorhq.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: process.env.GHL_CLIENT_ID!,
      client_secret: process.env.GHL_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      user_type: 'Location',
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);
  return res.json() as Promise<{
    access_token: string; refresh_token: string; expires_in: number;
    userType: 'Company' | 'Location'; locationId?: string; companyId?: string;
  }>;
}
```

## 2. Exchange an Agency token for a Location token

```bash
curl -L "https://services.leadconnectorhq.com/oauth/locationToken" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Version: 2021-07-28" \
  -H "Authorization: Bearer $AGENCY_ACCESS_TOKEN" \
  -d '{ "companyId": "GNb7aIv4rQFV9iwNl5K", "locationId": "HjiMUOsCCHCjtxEf8PR" }'
```

```typescript
async function getLocationToken(agencyToken: string, companyId: string, locationId: string) {
  const res = await fetch('https://services.leadconnectorhq.com/oauth/locationToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Version: '2021-07-28',
      Authorization: `Bearer ${agencyToken}`,
    },
    body: JSON.stringify({ companyId, locationId }),
  });
  if (!res.ok) throw new Error(`location token exchange failed: ${res.status}`);
  return res.json();
}
```

## 3. Upsert a contact (Private Integration Token)

```bash
curl -X POST https://services.leadconnectorhq.com/contacts/upsert \
  -H "Authorization: Bearer $GHL_PIT" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{
    "locationId": "YOUR_LOCATION_ID",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+14155550101",
    "source": "webform-acme-landing",
    "tags": ["lead", "webinar-signup"],
    "customFields": [{ "id": "CUSTOM_FIELD_ID", "value": "Acme Corp" }]
  }'
```

```typescript
interface UpsertContactInput {
  locationId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  source?: string;
  tags?: string[];
  customFields?: { id: string; value: string }[];
  createNewIfDuplicateAllowed?: boolean;
}

async function upsertContact(token: string, input: UpsertContactInput) {
  const res = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Version: '2021-07-28',
    },
    body: JSON.stringify(input),
  });
  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After');
    throw new Error(`rate limited, retry after ${retryAfter}s`);
  }
  if (!res.ok) throw new Error(`upsert failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ new: boolean; contact: Record<string, unknown>; traceId: string }>;
}
```

## 4. Resolve a pipeline and create an opportunity

```bash
curl -X GET "https://services.leadconnectorhq.com/opportunities/pipelines?locationId=$LOCATION_ID" \
  -H "Authorization: Bearer $GHL_TOKEN" \
  -H "Version: 2021-07-28"
```

```typescript
async function createOpportunityInFirstStage(token: string, locationId: string, contactId: string, name: string) {
  const pipelinesRes = await fetch(
    `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${locationId}`,
    { headers: { Authorization: `Bearer ${token}`, Version: '2021-07-28' } }
  );
  const { pipelines } = await pipelinesRes.json();
  const pipeline = pipelines[0];
  const firstStage = pipeline.stages[0];

  const createRes = await fetch('https://services.leadconnectorhq.com/opportunities/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Version: '2021-07-28' },
    body: JSON.stringify({
      locationId, pipelineId: pipeline.id, pipelineStageId: firstStage.id,
      name, contactId, status: 'open',
    }),
  });
  if (!createRes.ok) throw new Error(`create opportunity failed: ${createRes.status}`);
  return createRes.json();
}
```

## 5. Send an SMS

```bash
curl -X POST https://services.leadconnectorhq.com/conversations/messages \
  -H "Authorization: Bearer $GHL_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{ "type": "SMS", "contactId": "CONTACT_ID", "message": "Thanks for reaching out!" }'
```

```typescript
async function sendSms(token: string, contactId: string, message: string) {
  const res = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Version: '2021-07-28' },
    body: JSON.stringify({ type: 'SMS', contactId, message }),
  });
  if (!res.ok) throw new Error(`send message failed: ${res.status}`);
  return res.json();
}
```

## 6. Enroll a contact in an existing workflow

```bash
curl -X POST "https://services.leadconnectorhq.com/contacts/$CONTACT_ID/workflow/$WORKFLOW_ID" \
  -H "Authorization: Bearer $GHL_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{}'
```

Grounding: [raw/ghl--workflows--add-contact-to-workflow-endpoint.md]

All examples above are grounded in worked examples or OpenAPI schemas from the raw archive; treat exact response shapes as directional and verify against your own account before shipping to production, since no source in this archive was a live, currently-executable API call.
