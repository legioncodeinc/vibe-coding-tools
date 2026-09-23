# Edge Case: Modal Flow with Timeout Handling

A worked example showing a modal (form dialog) triggered by a slash command, with proper timeout and orphaned-interaction handling.

*Demonstrates: `guides/07-components-modals.md`*

---

## Scenario

A `/report <user>` slash command opens a modal asking the reporter to describe the issue. If the user does not submit within 5 minutes, the bot cleans up gracefully.

---

## The command + modal handler (discord.js v14)

```ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalSubmitInteraction,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("report")
  .setDescription("Report a user to moderators")
  .addUserOption(opt =>
    opt.setName("user").setDescription("User to report").setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("user", true);

  const modal = new ModalBuilder()
    .setCustomId(`report:${interaction.user.id}:${target.id}`)
    .setTitle(`Report ${target.username}`);

  const reasonInput = new TextInputBuilder()
    .setCustomId("reason")
    .setLabel("Describe the issue")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(10)
    .setMaxLength(500);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput)
  );

  // Show modal — this does NOT reply; the modal IS the response
  await interaction.showModal(modal);

  // Wait for submission or timeout
  const submitted = await interaction
    .awaitModalSubmit({
      time: 5 * 60 * 1000, // 5 minutes
      filter: (i: ModalSubmitInteraction) =>
        i.customId === `report:${interaction.user.id}:${target.id}`,
    })
    .catch(() => null); // null on timeout

  if (!submitted) {
    // Modal timed out — interaction token has expired, cannot send a DM here
    // Log server-side only; don't attempt to send a message (token is dead)
    console.log(`Report modal timed out for user ${interaction.user.id}`);
    return;
  }

  const reason = submitted.fields.getTextInputValue("reason");

  // Acknowledge submission with an ephemeral reply
  await submitted.reply({
    content: `Your report has been submitted. Reason: ${reason}`,
    ephemeral: true,
  });

  // Forward to mod log channel
  const modChannel = interaction.guild?.channels.cache.get(process.env.MOD_LOG_CHANNEL_ID!);
  if (modChannel?.isTextBased()) {
    await modChannel.send(
      `**Report** from <@${interaction.user.id}> against <@${target.id}>:\n${reason}`
    );
  }
}
```

---

## What this example demonstrates

| Pattern | Where |
|---------|-------|
| `custom_id` includes both reporter and target IDs | Prevents cross-user submission |
| `awaitModalSubmit` with `.catch(() => null)` | Handles timeout without throwing |
| Silent timeout handling (no attempt to reply) | Interaction token is expired after 5 min; attempting to reply throws |
| Ephemeral acknowledgement | Only the reporter sees the confirmation |
| `minLength` / `maxLength` on text input | Server-side Discord validation; no custom validation needed |

---

## Common mistake to avoid

**Do not attempt to `.reply()` to the original slash command interaction AFTER showing a modal.** `showModal()` consumes the interaction response: calling `.reply()` or `.deferReply()` afterward throws `InteractionAlreadyReplied`. The modal submission creates a new interaction object (`submitted`) that must be used for the response.
