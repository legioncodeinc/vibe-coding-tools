"""
Minimal Bolt for Python (async) app scaffold.
Covers: slash command + modal + Events API.

Replace all TODO comments with your app's actual logic.
See guides/ for detailed patterns for each surface.

Install: pip install slack-bolt
"""

import asyncio
import json
import os
from slack_bolt.async_app import AsyncApp
from slack_bolt.adapter.socket_mode.async_handler import AsyncSocketModeHandler

# ---------------------------------------------------------------------------
# App initialization
# ---------------------------------------------------------------------------

# Single-workspace dev app (no OAuth):
app = AsyncApp(
    token=os.environ["SLACK_BOT_TOKEN"],
    signing_secret=os.environ["SLACK_SIGNING_SECRET"],
)

# For Socket Mode, add:
# appToken=os.environ["SLACK_APP_TOKEN"]  (see handler at bottom)

# ---------------------------------------------------------------------------
# Slash command
# ---------------------------------------------------------------------------

@app.command("/TODO_COMMAND")
async def handle_command(ack, command, client):
    # Always acknowledge first (3-second deadline)
    await ack()

    # TODO: Open a modal, post a message, or dispatch async work here.
    # Example: open a modal
    await client.views_open(
        trigger_id=command["trigger_id"],
        view={
            "type": "modal",
            "callback_id": "TODO_MODAL_CALLBACK_ID",
            "title": {"type": "plain_text", "text": "TODO: Modal title"},
            "submit": {"type": "plain_text", "text": "Submit"},
            "close": {"type": "plain_text", "text": "Cancel"},
            "private_metadata": json.dumps({"channelId": command["channel_id"]}),
            "blocks": [
                {
                    "type": "input",
                    "block_id": "TODO_input_block",
                    "label": {"type": "plain_text", "text": "TODO: Label"},
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "TODO_input_action",
                    },
                }
            ],
        },
    )


# ---------------------------------------------------------------------------
# Modal submission
# ---------------------------------------------------------------------------

@app.view("TODO_MODAL_CALLBACK_ID")
async def handle_view_submission(ack, body, view, client):
    values = view["state"]["values"]
    input_value = values["TODO_input_block"]["TODO_input_action"]["value"]

    # Validate
    if not input_value:
        await ack(
            response_action="errors",
            errors={"TODO_input_block": "This field is required"},
        )
        return

    await ack()  # Closes the modal

    metadata = json.loads(view.get("private_metadata") or "{}")
    user_id = body["user"]["id"]
    channel_id = metadata.get("channelId")

    # TODO: Do the actual work asynchronously
    asyncio.create_task(do_work(input_value, user_id, channel_id, client))


async def do_work(value: str, user_id: str, channel_id: str, client):
    # TODO: Replace with actual logic
    await client.chat_postMessage(
        channel=channel_id,
        text=f"<@{user_id}> submitted: {value}",
    )


# ---------------------------------------------------------------------------
# Events API
# ---------------------------------------------------------------------------

@app.event("app_mention")
async def handle_mention(event, say):
    # TODO: Handle @mentions
    await say(text=f"Hello <@{event['user']}>!", thread_ts=event["ts"])


@app.event("message")
async def handle_message(event, logger):
    if event.get("subtype"):
        return  # Ignore edits, deletes, bot messages
    logger.info(f"Message in {event['channel']}: {event.get('text')}")


# ---------------------------------------------------------------------------
# Interactive action
# ---------------------------------------------------------------------------

@app.action("TODO_ACTION_ID")
async def handle_action(ack, respond):
    await ack()
    # TODO: Handle the button click or select change
    await respond(text="Action received!")


# ---------------------------------------------------------------------------
# Start
# ---------------------------------------------------------------------------

async def main():
    # HTTP mode (default):
    await app.start(port=int(os.environ.get("PORT", "3000")))

    # Socket Mode (uncomment for internal/behind-firewall apps):
    # handler = AsyncSocketModeHandler(app, os.environ["SLACK_APP_TOKEN"])
    # await handler.start_async()


if __name__ == "__main__":
    asyncio.run(main())
