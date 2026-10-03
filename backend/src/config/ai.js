const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAIInstance = null;

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIInstance) {
    try {
      genAIInstance = new GoogleGenerativeAI(apiKey);
    } catch (err) {
      console.warn('Failed to initialize GoogleGenerativeAI client:', err.message);
      return null;
    }
  }
  return genAIInstance;
};

const getModel = (modelName = 'gemini-1.5-flash') => {
  const client = getAIClient();
  if (!client) return null;
  return client.getGenerativeModel({ model: modelName });
};

module.exports = {
  getAIClient,
  getModel,
};
