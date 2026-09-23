# Guide 02: Bot Features

> Sources: `research/bot-api/2026-05-20-bot-api-10-guest-mode.md`, `research/frameworks/2026-05-20-grammy-latest-version.md`, `research/frameworks/2026-05-20-aiogram-3x-pypi-status.md`, `research/architecture/2026-05-20-rate-limits-production.md`

---

## Commands

Register commands with BotFather (`/setcommands`) and handle them in code.

### grammY
```typescript
bot.command("start", (ctx) => ctx.reply("Welcome!"));
bot.command("help", (ctx) => ctx.reply("Commands: /start /help"));

// Command with argument
bot.command("search", (ctx) => {
  const query = ctx.match; // Text after /search
  ctx.reply(`Searching for: ${query}`);
});
```

### aiogram 3.x
```python
from aiogram.filters import Command

@dp.message(Command("start"))
async def handle_start(message: Message):
    await message.answer("Welcome!")

@dp.message(Command("search"))
async def handle_search(message: Message, command: CommandObject):
    await message.answer(f"Searching: {command.args}")
```

---

## Keyboards

### Inline keyboards (attached to messages)
```typescript
// grammY inline keyboard
import { InlineKeyboard } from "grammy";

const keyboard = new InlineKeyboard()
  .text("Option A", "callback_a")
  .text("Option B", "callback_b")
  .row()
  .url("Visit site", "https://example.com");

await ctx.reply("Choose:", { reply_markup: keyboard });

// Handle callback
bot.callbackQuery("callback_a", async (ctx) => {
  await ctx.answerCallbackQuery(); // REQUIRED within 30 seconds
  await ctx.editMessageText("You chose A");
});
```

```python
# aiogram 3.x inline keyboard
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

kb = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="Option A", callback_data="callback_a"),
     InlineKeyboardButton(text="Option B", callback_data="callback_b")],
])

await message.answer("Choose:", reply_markup=kb)

@dp.callback_query(F.data == "callback_a")
async def handle_a(query: CallbackQuery):
    await query.answer()  # REQUIRED within 30 seconds
    await query.message.edit_text("You chose A")
```

**Critical:** `answerCallbackQuery` / `query.answer()` MUST be called within 30 seconds. Failure causes Telegram to show an error spinner to the user and retry, producing duplicate processing.

### Reply keyboards (persistent bottom keyboard)
```typescript
import { Keyboard } from "grammy";

const keyboard = new Keyboard()
  .text("Option A")
  .text("Option B")
  .resized();

await ctx.reply("Use the keyboard:", { reply_markup: keyboard });
```

---

## FSM Conversations (stateful flows)

Use sessions + conversations for multi-step flows (onboarding, forms, etc.).

### grammY conversations plugin
```typescript
import { conversations, createConversation } from "@grammyjs/conversations";
import { session } from "grammy";

// Session storage (in-memory; use Redis adapter for production)
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

async function onboarding(conversation: Conversation, ctx: Context) {
  await ctx.reply("What is your name?");
  const { message } = await conversation.wait();
  const name = message?.text ?? "Unknown";
  
  await ctx.reply(`Hello ${name}! What is your email?`);
  const emailCtx = await conversation.wait();
  const email = emailCtx.message?.text ?? "";
  
  await ctx.reply(`Registered ${name} with ${email}`);
}

bot.use(createConversation(onboarding));
bot.command("register", (ctx) => ctx.conversation.enter("onboarding"));
```

### aiogram FSMContext
```python
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

class Registration(StatesGroup):
    waiting_name = State()
    waiting_email = State()

@dp.message(CommandStart())
async def start_registration(message: Message, state: FSMContext):
    await state.set_state(Registration.waiting_name)
    await message.answer("What is your name?")

@dp.message(Registration.waiting_name)
async def handle_name(message: Message, state: FSMContext):
    await state.update_data(name=message.text)
    await state.set_state(Registration.waiting_email)
    await message.answer("What is your email?")

@dp.message(Registration.waiting_email)
async def handle_email(message: Message, state: FSMContext):
    data = await state.get_data()
    await state.clear()
    await message.answer(f"Registered {data['name']} with {message.text}")
```

---

## File handling

### Sending files
```typescript
// grammY
await ctx.replyWithDocument(new InputFile("./report.pdf"), { caption: "Report" });
await ctx.replyWithPhoto("https://example.com/image.jpg");
```

### Receiving files
```typescript
bot.on("message:document", async (ctx) => {
  const fileId = ctx.message.document.file_id;
  const file = await ctx.getFile();
  // file.file_path gives download path
  // https://api.telegram.org/file/bot{TOKEN}/{file_path}
});
```

---

## Bot API 10.0: Guest Mode (new May 2026)

Guest mode allows bots to respond in chats they are NOT a member of. The `Update` object now includes `guest_message` updates.

**How it works:**
- Users can forward a message to your bot from any chat
- Your bot can call `answerGuestQuery` to respond to the original chat
- The bot doesn't join the chat; it has a one-shot response window

```typescript
// Handle guest messages (Bot API 10.0)
bot.on("guest_message", async (ctx) => {
  await ctx.answerGuestQuery("Here is my response to the original chat");
});
```

> TODO: Full `answerGuestQuery` method signature and `guest_message` Update type fields: these were not fully captured in this research pass. Check https://core.telegram.org/bots/api for the complete method reference before implementing guest mode features.

---

## Rate limits

From `research/architecture/2026-05-20-rate-limits-production.md`:

| Limit | Value |
|---|---|
| Global rate | 30 messages/second |
| Per chat | 1 message/second |
| Per group (bulk) | 20 messages/minute |
| getUpdates max limit | 100 updates per call |
| File upload max | 50 MB |

**Handling rate limits:**
```typescript
// grammY auto-retry plugin handles 429 responses
import { autoRetry } from "@grammyjs/auto-retry";
bot.api.config.use(autoRetry());
```

```python
# aiogram rate limiter middleware
from aiogram.utils.chat_action import ChatActionSender

# aiogram 3.x has built-in rate-limit handling; use ThrottlingMiddleware
from aiogram.fsm.middleware import ThrottlingMiddleware
dp.message.middleware(ThrottlingMiddleware(throttle_time=0.5))
```
