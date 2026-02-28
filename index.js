require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(3000, () => console.log("Web server running"));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const allowedChannel = "1477189198120489130";

let predictions = {};

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.channel.id !== allowedChannel) return;

  const args = message.content.split(" ");

  if (args[0] === "!start") {
    predictions = {};
    message.channel.send("Prediction started! Use `!predict option`");
  }

  if (args[0] === "!predict") {
    const choice = args.slice(1).join(" ");
    if (!choice) return message.reply("Enter something to predict!");

    predictions[message.author.id] = choice;
    message.reply(`You predicted: ${choice}`);
  }

  if (args[0] === "!end") {
    let result = "📊 **Results:**\n";
    for (let user in predictions) {
      result += `<@${user}> → ${predictions[user]}\n`;
    }

    if (Object.keys(predictions).length === 0) {
      message.channel.send("No predictions made.");
    } else {
      message.channel.send(result);
    }

    predictions = {};
  }
});

client.login(process.env.TOKEN);
