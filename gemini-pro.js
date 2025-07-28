require('dotenv').config();

console.log('Loaded API_KEY:', process.env.API_KEY);  // Confirm key loads

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = "Write a sonnet about a programmer's life, but also have it rhyme.";

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    } catch (error) {
        console.error('Error generating content:', error);
    }
}

const path = require('path');
console.log('Current directory:', __dirname);
console.log('Resolved .env path:', path.resolve(__dirname, '.env'));
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log('Loaded API_KEY:', process.env.API_KEY);


run();
