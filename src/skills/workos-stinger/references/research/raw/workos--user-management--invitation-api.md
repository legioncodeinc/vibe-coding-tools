# Invitation API reference

- URL: https://workos.com/docs/reference/authkit/invitation
- Fetched: 2026-08-14
- Source type: Official API reference (workos.com/docs/reference)
- Component: User Management API / Invitations

## Content

An email invitation lets the recipient sign up for the app and join a specific organization. When accepted, both a User and a corresponding Organization Membership are created. Users can be invited without an organization, or invited to join an org even without a matching email domain (e.g. contractors). Invitations can be issued on behalf of another user - the invite email mentions that user's name.

### Create an invitation

`POST /user_management/invitations`

Request fields: `email` (required), `organization_id` (optional), `role_slug` (optional - role granted on acceptance), `expires_in_days` (optional, 1-30, default 7), `inviter_user_id` (optional - name shown in the invite email), `locale` (optional, for localized invite email).

### Accept an invitation

`POST /user_management/invitations/{id}/accept`

In most cases, prefer existing auth methods like `authenticateWithCode`, which also accepts an invitation token and performs both invitation acceptance and sign-in in one call. Use the standalone accept-invitation method only for highly customized invitation flows, or when a user can be invited to multiple orgs and needs to accept after already being signed in.

The application should verify the invitation is intended for the accepting user (e.g. fetch via find-by-token and confirm the email matches).

```js
const invitation = await workos.userManagement.acceptInvitation('invitation_01E4ZCR3C56J083X43JQXF3JK5');
```

### Find an invitation by token

`GET /user_management/invitations/by_token/{token}`

### Object shape

```json
{
  "object": "invitation",
  "id": "invitation_01E4ZCR3C56J083X43JQXF3JK5",
  "email": "marcelina.davis@example.com",
  "state": "pending",
  "accepted_at": null,
  "revoked_at": null,
  "expires_at": "2026-01-15T12:00:00.000Z",
  "organization_id": "org_01E4ZCR3C56J083X43JQXF3JK5",
  "inviter_user_id": "user_01HYGBX8ZGD19949T3BM4FW1C3",
  "accepted_user_id": null,
  "role_slug": "admin",
  "created_at": "2026-01-15T12:00:00.000Z",
  "updated_at": "2026-01-15T12:00:00.000Z",
  "token": "<WORKOS_INVITATION_TOKEN>",
  "accept_invitation_url": "https://example.invalid/invite?invitation_token=<WORKOS_INVITATION_TOKEN>"
}
```

`state` is one of `pending` | `accepted` | `expired` | `revoked`. `role_slug` reflects the current role on the invitee's org membership once accepted; `null` if the invitation has no associated organization.

### Other endpoints

`GET /user_management/invitations/{id}` - get a single invitation.
`GET /user_management/invitations` - list, filterable by `organization_id` and `email`.
Revoke invitation endpoint also exists (referenced by `state: "revoked"`).
