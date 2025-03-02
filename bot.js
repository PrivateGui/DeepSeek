const TelegramBot = require('node-telegram-bot-api');
const { HfInference } = require('@huggingface/inference');

// Your tokens
const TELEGRAM_TOKEN = '7435111550:AAGggKVIoyYQI-UQmpqIyB31VEM6f2sINeY';
const HF_TOKEN = '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';

// Initialize the Hugging Face client
const hfClient = new HfInference(HF_TOKEN);

// Create a new bot instance
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (!userMessage) return;

  try {
    bot.sendChatAction(chatId, 'typing');

    // Get AI response using Hugging Face conversational API
    const response = await hfClient.conversational({
      model: 'deepseek-ai/DeepSeek-V3',
      inputs: {
        past_user_inputs: [],
        generated_responses: [],
        text: userMessage,
      },
      parameters: {
        max_new_tokens: 500,
      }
    });

    bot.sendMessage(chatId, response.generated_text);
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, '💀 I broke while answering.');
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');
