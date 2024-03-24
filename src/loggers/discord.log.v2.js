"use strict"
const { Client, GatewayIntentBits } = require("discord.js")
const { DISCORD_CHANNEL_ID, DISCORD_TOEKN } = process.env
class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    })
    this.channelId = DISCORD_CHANNEL_ID
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}`)
    })
    this.client.login(DISCORD_TOEKN)
	}
	sendToMessage(message = 'message') {
		const channel = this.client.channels.cache.get(this.channelId)
		if (!channel) {
			console.log('Channel not found')
			return
		}
		channel.send(message).catch(console.error)
	}
	sendToFomatCode(logData) {
		const { code, message = `this is some additional about the code.`, title = 'Title' } = logData
		const codeMessage = {
			content: message,
			embeds: [
				{
					color: parseInt('00ff00', 16),
					title,
					description: '```json\n' + JSON.stringify (code, null, 2) + '\n```'
				}
			]
		}
		this.sendToMessage(codeMessage)
	}
}
const loggerService = new LoggerService()
module.exports = loggerService