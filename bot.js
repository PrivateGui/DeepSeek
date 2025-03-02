const TelegramBot = require('node-telegram-bot-api');
const { HfInference } = require('@huggingface/inference');

// Your tokens
const TELEGRAM_TOKEN = '7435111550:AAGggKVIoyYQI-UQmpqIyB31VEM6f2sINeY';
const HF_TOKEN = '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';

const hfClient = new HfInference(HF_TOKEN);
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (!userMessage) return;

  try {
    bot.sendChatAction(chatId, 'typing');

    // Use the model "perplexity-ai/r1-1776"
    const chatCompletion = await hfClient.chatCompletion({
      model: "perplexity-ai/r1-1776", // Your chosen model
      messages: [
        { role: "user", content: userMessage }
      ],
      provider: "fireworks-ai",
      max_tokens: 500,
    });

    const aiResponse = chatCompletion.choices[0].message.content;
    bot.sendMessage(chatId, aiResponse);
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, '💀 I broke while answering. Error: ' + error.message);
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');
