import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

/**
 * Define your database schemas here.  You can use multiple files for
 * organization if you desire.
 */

export const tizkuLog = sqliteTable('tizku-log', {
	transactionId: integer('transaction-id').primaryKey({ autoIncrement: true }),
	giverId: text('giver-id').notNull(),
	recipientId: text('recipient-id').notNull(),
	messageId: text('message-id').notNull(),
});
