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

    // Use textGeneration instead of chatCompletion for BlenderBot
    const chatCompletion = await hfClient.textGeneration({
      model: "facebook/blenderbot-3B",  // A conversational model
      inputs: userMessage,              // Text input to generate a response
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
      },
    });

    const aiResponse = chatCompletion.generated_text.trim();
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
