import { type Client, Events } from 'discord.js';
import { GatewayEventSpark } from '../../core/sparks';

export class GatewayEvent extends GatewayEventSpark<Events.ClientReady> {
	once = true;
	eventType = Events.ClientReady as const;
	gates = {};

	override execute(client: Client<true>): void {
		client.logger.info(`✅ ${client.user?.tag} logged in.`);
	}
}
