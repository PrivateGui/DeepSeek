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

    // Try using text generation instead of conversational
    const response = await hfClient.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct', // Use a model that works with text generation
      inputs: userMessage,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
      },
    });

    bot.sendMessage(chatId, response.generated_text.trim());
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
