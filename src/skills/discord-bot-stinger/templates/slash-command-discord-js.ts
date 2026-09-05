/**
 * Minimal idiomatic slash command template for discord.js v14.
 *
 * Replace placeholders:
 *   COMMAND_NAME        — lowercase, hyphens only, max 32 chars
 *   COMMAND_DESCRIPTION — 1-100 chars
 *   OPTION_NAME         — lowercase option name (optional; remove if no options needed)
 *   OPTION_DESCRIPTION  — option description
 */
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("COMMAND_NAME")
  .setDescription("COMMAND_DESCRIPTION")
  // Remove addStringOption block if the command takes no options
  .addStringOption(opt =>
    opt
      .setName("OPTION_NAME")
      .setDescription("OPTION_DESCRIPTION")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // For fast responses (< 3 seconds):
  await interaction.reply({ content: "Your response here.", ephemeral: false });

  // For slow operations (> 3 seconds), replace the reply above with:
  // await interaction.deferReply();
  // const result = await yourSlowOperation();
  // await interaction.editReply(result);
}
