import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateUserStory = async (title) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Create a user story titled: ${title}`,
    max_tokens: 100,
  });
  return response.data.choices[0].text;
};
