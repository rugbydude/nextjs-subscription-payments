import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateUserStory = async (title) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that creates user stories for software development projects.'
      },
      {
        role: 'user',
        content: `Create a user story titled: ${title}`
      }
    ],
    max_tokens: 100,
  });
  return response.choices[0].message.content;
};
