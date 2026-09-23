# Derived Example: Hosted AI Behind a Rust Command Boundary

This pattern keeps provider traffic out of the WebView. The code is vendor-neutral and intentionally calls a publisher service rather than embedding a publisher-owned provider key in the desktop application.

## Managed client state

```rust
use reqwest::{Client, Url};

pub struct HostedAiState {
    pub client: Client,
    pub service_base: Url,
}
```

Initialize the client and validated service URL once during application setup, then register it with `.manage(...)`.

## Narrow command

Put this command in a dedicated module such as `src-tauri/src/ai_commands.rs`, not directly in `lib.rs`. A command in a separate module is public so the application can register it; a command declared directly in `lib.rs` must not be public because Tauri generates a conflicting symbol.

```rust
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SummaryRequest {
    document_id: String,
    text: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SummaryResponse {
    summary: String,
    model: String,
}

#[derive(Serialize)]
#[serde(tag = "code", content = "message", rename_all = "snake_case")]
pub enum SummaryError {
    InvalidRequest(String),
    Unavailable(String),
}

#[tauri::command]
pub async fn summarize_document(
    request: SummaryRequest,
    state: State<'_, HostedAiState>,
) -> Result<SummaryResponse, SummaryError> {
    if request.document_id.len() > 128 || request.text.len() > 256 * 1024 {
        return Err(SummaryError::InvalidRequest("request exceeds limits".into()));
    }

    let endpoint = state
        .service_base
        .join("v1/summaries")
        .map_err(|_| SummaryError::Unavailable("service configuration invalid".into()))?;

    let response = state
        .client
        .post(endpoint)
        // Add the authenticated desktop-user session here. Do not add a
        // publisher-owned provider key to the application binary.
        .json(&serde_json::json!({
            "documentId": request.document_id,
            "text": request.text,
        }))
        .send()
        .await
        .map_err(|_| SummaryError::Unavailable("summary service unavailable".into()))?;

    if !response.status().is_success() {
        return Err(SummaryError::Unavailable("summary service rejected request".into()));
    }

    response
        .json::<SummaryResponse>()
        .await
        .map_err(|_| SummaryError::Unavailable("summary response invalid".into()))
}
```

## Boundary decisions

- Authenticate the user to the publisher service in Rust.
- Enforce tenant, usage, and model policy at the service.
- Keep frontend CSP free of the AI provider origin when the WebView never calls it.
- Return stable errors without provider bodies, tokens, or internal URLs.
- For streamed output, combine this boundary with [01-typed-ai-channel.md](01-typed-ai-channel.md).

Source basis: [Process model](../references/research/raw/tauri--docs--process-model.md), [CSP](../references/research/raw/tauri--docs--content-security-policy.md), and [command transport](../references/research/raw/tauri--docs--calling-rust.md).
