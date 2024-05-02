import { Events, type Interaction, type Client } from 'discord.js';

export const interactionCreateHandler: GatewayEventHandler = {
	type: Events.InteractionCreate,
	once: false,
	async execute(client: Client, interaction: Interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			const coolDown = interaction.client.coolDowns.get(
				`${interaction.commandName}-${interaction.user.username}`,
			);
			if (!command) return;
			if (command.coolDownSeconds && coolDown) {
				if (Date.now() < coolDown) {
					await interaction.reply(
						`You have to wait ${Math.floor(
							Math.abs(Date.now() - coolDown) / 1000,
						)} second(s) to use this command again.`,
					);
					setTimeout(async () => interaction.deleteReply(), 5000);
					return;
				}

				interaction.client.coolDowns.set(
					`${interaction.commandName}-${interaction.user.username}`,
					Date.now() + command.coolDownSeconds * 1000,
				);
				setTimeout(() => {
					interaction.client.coolDowns.delete(
						`${interaction.commandName}-${interaction.user.username}`,
					);
				}, command.coolDownSeconds * 1000);
			} else if (command.coolDownSeconds && !coolDown) {
				interaction.client.coolDowns.set(
					`${interaction.commandName}-${interaction.user.username}`,
					Date.now() + command.coolDownSeconds * 1000,
				);
			}

			command.execute(interaction);
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				client.logger.warn(
					`No command matching ${interaction.commandName} was found.`,
				);
				return;
			}

			try {
				if (!command.autocomplete) return;
				command.autocomplete(interaction);
			} catch (exception) {
				client.logger.warn(String(exception));
			}
		} else if (interaction.isModalSubmit()) {
			const command = interaction.client.commands.get(interaction.customId);
			if (!command) {
				client.logger.warn(
					`No command matching ${interaction.customId} was found.`,
				);
				return;
			}

			try {
				if (!command.modal) return;
				command.modal(interaction);
			} catch (exception) {
				client.logger.warn(String(exception));
			}
		}
	},
};
