import { Configuration, OpenAIApi } from 'openai';
import { CreateUserStoryInput, UserStory } from '@/types/story';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface GenerateStoryOptions {
  projectContext?: string;
  epicContext?: string;
  existingStories?: UserStory[];
}

export async function generateUserStory(
  input: Partial<CreateUserStoryInput>,
  options?: GenerateStoryOptions
): Promise<Partial<UserStory>> {
  const prompt = buildStoryPrompt(input, options);
  
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert agile product manager and technical writer. Your task is to help create well-structured user stories that follow INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable).`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const response = completion.data.choices[0]?.message?.content;
  if (!response) throw new Error('Failed to generate story');

  return parseAIResponse(response);
}

export async function generateAcceptanceCriteria(
  story: Partial<UserStory>
): Promise<string[]> {
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert in writing acceptance criteria for user stories. Create clear, testable acceptance criteria that follow the Given-When-Then format.`
      },
      {
        role: "user",
        content: `Generate acceptance criteria for the following user story:
        Title: ${story.title}
        Description: ${story.description}
        Type: ${story.type}
        Business Value: ${story.business_value || 'Not specified'}`
      }
    ],
    temperature: 0.7,
  });

  const response = completion.data.choices[0]?.message?.content;
  if (!response) throw new Error('Failed to generate acceptance criteria');

  return parseAcceptanceCriteria(response);
}

export async function suggestImprovements(
  story: UserStory
): Promise<Partial<UserStory['ai_suggestions']>> {
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert agile coach. Analyze the user story and suggest improvements for story points, potential risks, and similar stories to consider.`
      },
      {
        role: "user",
        content: `Analyze this user story and suggest improvements:
        ${JSON.stringify(story, null, 2)}`
      }
    ],
    temperature: 0.7,
  });

  const response = completion.data.choices[0]?.message?.content;
  if (!response) throw new Error('Failed to generate suggestions');

  return parseSuggestions(response);
}

function buildStoryPrompt(
  input: Partial<CreateUserStoryInput>,
  options?: GenerateStoryOptions
): string {
  let prompt = 'Generate a user story';
  
  if (input.title) {
    prompt += ` based on the title: "${input.title}"`;
  }
  
  if (input.description) {
    prompt += ` and description: "${input.description}"`;
  }

  if (options?.projectContext) {
    prompt += `\nProject Context: ${options.projectContext}`;
  }

  if (options?.epicContext) {
    prompt += `\nEpic Context: ${options.epicContext}`;
  }

  if (options?.existingStories?.length) {
    prompt += '\nExisting Stories in the Project:';
    options.existingStories.forEach(story => {
      prompt += `\n- ${story.title}`;
    });
  }

  prompt += '\n\nProvide the story in JSON format with title, description, type, priority, size, and suggested acceptance criteria.';
  
  return prompt;
}

function parseAIResponse(response: string): Partial<UserStory> {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    const story = JSON.parse(jsonMatch[0]);
    return {
      ...story,
      ai_suggestions: {
        acceptance_criteria: story.acceptance_criteria,
      },
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Failed to parse AI response');
  }
}

function parseAcceptanceCriteria(response: string): string[] {
  return response
    .split('\n')
    .filter(line => line.trim().startsWith('Given') || line.trim().startsWith('When') || line.trim().startsWith('Then'))
    .map(line => line.trim());
}

function parseSuggestions(response: string): Partial<UserStory['ai_suggestions']> {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Failed to parse AI suggestions:', error);
    throw new Error('Failed to parse AI suggestions');
  }
} 