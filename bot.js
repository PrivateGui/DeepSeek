// Import required packages
const TelegramBot = require('node-telegram-bot-api');
const { HfInference } = require('@huggingface/inference');

// Replace with your tokens
const TELEGRAM_TOKEN = '7435111550:AAGggKVIoyYQI-UQmpqIyB31VEM6f2sINeY';
const HF_TOKEN = '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'; // Replace hf_xxxxxxxxxxxxxxxxxxxxxxxx

// Initialize the Hugging Face client
const hfClient = new HfInference(HF_TOKEN);

// Create a new bot instance
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Listen for any message
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;
  
  // If the message is empty, ignore it
  if (!userMessage) return;
  
  try {
    // Send "typing..." action
    bot.sendChatAction(chatId, 'typing');
    
    // Get AI response using Hugging Face API
    const chatCompletion = await hfClient.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ],
      provider: "together",
      max_tokens: 500,
    });
    
    // Extract and send the response
    const aiResponse = chatCompletion.choices[0].message.content;
    bot.sendMessage(chatId, aiResponse);
    
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, 'Sorry, I encountered an error while processing your request.');
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Log when bot is running
console.log('Bot is running...');
