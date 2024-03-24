"use strict"
const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
})
const token = process.env.DISCORD_TOKEN
client.login(token)

client.on("messageCreate", (message) => {
	if(message.author.bot) return
	if (message.content === "hello") {
		message.reply("Hello, how are you?")
	}
})