# Calendar Events + Send a new message | HighLevel API (official)

- URL: https://marketplace.gohighlevel.com/docs/2021-04-15/ghl/calendars/calendar-events
- Secondary URL: https://marketplace.gohighlevel.com/docs/ghl/conversations/send-a-new-message/
- Third URL: https://docs.rs/ghl-sdk/latest/ghl_sdk/conversations/index.html
- Fetched: 2026-08-14
- Source type: Official endpoint docs + community Rust SDK docs (generated from the same OpenAPI spec)
- Component: calendars/appointments, conversations/messages - endpoint catalog

## Calendars (official doc index, dated 2021-04-15 version but structurally still current per the version switcher)

Documented sub-pages: Create appointment, Update Appointment, Get Appointment, Get Calendar Events. Separately, `GET /calendars/schedules/event-calendar/:calendarId` "Retrieve the availability schedule for a specific event calendar" -- confirms an availability-lookup endpoint distinct from appointment CRUD.

## Conversations / messages

- `POST /conversations/messages` -- "Post the necessary fields for the API to send a new message."
- Full endpoint table (community SDK, generated from OpenAPI spec, 29 v2 endpoints total for this resource):
  | Method | Endpoint | Scope |
  |---|---|---|
  | search | `GET /conversations/search` | `conversations.readonly` |
  | messages | `GET /conversations/{id}/messages` | `conversations/message.readonly` |
  | send_message | `POST /conversations/messages` | `conversations/message.write` |
- Channels accepted by `type` on send: `SMS`, `RCS`, `Email`, `WhatsApp`, `IG`, `FB`, `Custom`, `Live_Chat`, `TIKTOK` (per the `SendMessageBodyDto` schema definition mirrored on docs.rs).
- Email-specific fields: `emailFrom`, `emailTo`, `subject`, `emailReplyMode` (`reply` or `reply_all`), `forward`.
- A third-party MCP tool catalog (glama.ai, documenting `ghl_conversation_send_message` against the v3 spec file `v3/conversations-v3.json`) notes: "Per the official spec, requestBody.required = [type, subType, contactId, status] -- all four must be supplied or the API returns 400, even though `status` is unusual to set on an outbound send." This is a v3-surface detail (`Version: v3` header), distinct from the v2 `SendMessageBodyDto` shape above, which does not list `status` or `subType` as required.

## Notes for the distillation

Two schema shapes exist for "send a message" depending on API version header (`2021-07-28`/v2 vs `v3`) -- the v2 shape needs `type` + message-appropriate fields; a v3 shape (per third-party MCP tooling, not independently confirmed against an official v3 doc page in this archive) additionally requires `subType` and `status`. Treat the v3 requirement as **unconfirmed against a primary source** and flag it as a gap: test against the live `Version: v3` header response before shipping, since the v3 documentation portal was only partially reachable during this research pass (see the versioning conflict noted in the two v3-status raw files).
