import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateUserStory = async (title) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a product manager creating detailed user stories for software development projects.
Generate user stories in this format:
Title: [Story Title]
As a [type of user]
I want to [perform some action]
So that [achieve some goal]
Acceptance Criteria:
- [criterion 1]
- [criterion 2]
- [criterion 3]
Priority: [High/Medium/Low]
Story Points: [1/2/3/5/8]`
        },
        {
          role: 'user',
          content: `Create a detailed user story based on this title: ${title}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(error.message || 'Failed to generate story');
  }
};
