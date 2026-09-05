# Derived Example: Typed AI Output Through a Tauri Channel

This is an application pattern derived from Tauri's documented Channel transport. It is not a first-party Tauri AI sample. Start with this transport-only command, test the contract, then replace the demonstration token source with the chosen provider or local runtime.

## Rust command

Put this command in a dedicated module such as `src-tauri/src/ai_commands.rs`, not directly in `lib.rs`. A command in a separate module is public so the application can register it; a command declared directly in `lib.rs` must not be public because Tauri generates a conflicting symbol.

```rust
use serde::{Deserialize, Serialize};
use tauri::ipc::Channel;

const MAX_PROMPT_BYTES: usize = 64 * 1024;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerationRequest {
    request_id: String,
    model: String,
    prompt: String,
}

#[derive(Clone, Serialize)]
#[serde(
    tag = "event",
    content = "data",
    rename_all = "camelCase",
    rename_all_fields = "camelCase"
)]
pub enum GenerationEvent {
    Started { request_id: String, model: String },
    Token { request_id: String, text: String },
    Completed { request_id: String, finish_reason: String },
    Failed { request_id: String, code: String, message: String },
}

#[derive(Serialize)]
#[serde(tag = "code", content = "message", rename_all = "snake_case")]
pub enum CommandError {
    InvalidRequest(String),
    StreamClosed(String),
}

#[tauri::command]
pub async fn generate_completion(
    request: GenerationRequest,
    on_event: Channel<GenerationEvent>,
) -> Result<(), CommandError> {
    if request.request_id.trim().is_empty() {
        return Err(CommandError::InvalidRequest("request_id is required".into()));
    }
    if request.model.trim().is_empty() {
        return Err(CommandError::InvalidRequest("model is required".into()));
    }
    if request.prompt.is_empty() || request.prompt.len() > MAX_PROMPT_BYTES {
        return Err(CommandError::InvalidRequest("prompt length is invalid".into()));
    }

    on_event
        .send(GenerationEvent::Started {
            request_id: request.request_id.clone(),
            model: request.model,
        })
        .map_err(|error| CommandError::StreamClosed(error.to_string()))?;

    // Demonstration source only. Replace this loop with a bounded provider or
    // sidecar stream. Do not send credentials or raw provider objects.
    for word in request.prompt.split_whitespace() {
        on_event
            .send(GenerationEvent::Token {
                request_id: request.request_id.clone(),
                text: format!("{word} "),
            })
            .map_err(|error| CommandError::StreamClosed(error.to_string()))?;
    }

    on_event
        .send(GenerationEvent::Completed {
            request_id: request.request_id,
            finish_reason: "stop".into(),
        })
        .map_err(|error| CommandError::StreamClosed(error.to_string()))?;

    Ok(())
}
```

Register the module command once with the application's other commands:

```rust
.invoke_handler(tauri::generate_handler![ai_commands::generate_completion])
```

## TypeScript caller

```ts
import { Channel, invoke } from '@tauri-apps/api/core';

type GenerationEvent =
  | { event: 'started'; data: { requestId: string; model: string } }
  | { event: 'token'; data: { requestId: string; text: string } }
  | { event: 'completed'; data: { requestId: string; finishReason: string } }
  | { event: 'failed'; data: { requestId: string; code: string; message: string } };

export async function generate(prompt: string): Promise<void> {
  const requestId = crypto.randomUUID();
  const onEvent = new Channel<GenerationEvent>();

  onEvent.onmessage = (message) => {
    switch (message.event) {
      case 'started':
        setGenerationStatus(message.data.requestId, 'running');
        break;
      case 'token':
        appendText(message.data.requestId, message.data.text);
        break;
      case 'completed':
        setGenerationStatus(message.data.requestId, 'complete');
        break;
      case 'failed':
        showGenerationError(message.data.code, message.data.message);
        break;
    }
  };

  await invoke('generate_completion', {
    request: { requestId, model: selectedModel(), prompt },
    onEvent,
  });
}
```

## Production additions

- Add cancellation through a separate authorized command keyed by `request_id`.
- Bound individual event sizes and total output.
- Send exactly one terminal state.
- Remove secrets, raw prompts, and provider payloads from errors and logs.
- Test Channel closure, cancellation races, renderer reload, and application shutdown.

Source basis: [Calling Rust](../references/research/raw/tauri--docs--calling-rust.md), [Calling the frontend](../references/research/raw/tauri--docs--calling-frontend.md), and [Serde container attributes](../references/research/raw/serde--docs--container-attributes.md).
